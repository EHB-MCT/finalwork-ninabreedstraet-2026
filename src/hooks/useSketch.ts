import {
  useEffect,
  useRef,
  useCallback,
  type ReactNode,
  type RefObject,
} from "react";
import type { Sketch, ParamValues, ParamType } from "../pages/Maken/sketches";
import p5 from "p5";

// hetgeen dat deze functie moet ontvangen voor muis-animaties
interface MousePos {
  x: number;
  y: number;
  down: boolean;
}

export function useSketch(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  sketch: Sketch,
  params: ParamValues,
) {
  // id van het huidige animatie-frame zodat die gestopt kan worden
  const animRef = useRef<number | null>(null);
  // de frame-teller
  const tRef = useRef<number>(0);
  // een leeg object waar de gebruikerscode zelf dingen in kan opslaan tussen frames
  const stateRef = useRef<Record<string, unknown>>({});
  // de huidige muispositie en of de knop ingedrukt is, hier wordt een default waarde megegeven als false, dus de startende waarde is dat die niet is ingedrukt
  const mouseRef = useRef<MousePos>({ x: 0, y: 0, down: false });

  const p5Ref = useRef<p5 | null>(null);

  // een stop-functie die later kan gebruikt worden, als dit wordt ingezet, stopt de animatie
  const stop = useCallback(() => {
    if (animRef.current !== null) {
      cancelAnimationFrame(animRef.current);
      animRef.current = null;
    }
    if (p5Ref.current !== null) {
      p5Ref.current.remove();
      p5Ref.current = null;
    }
    // Herstelt het React canvas als het verborgen werd door p5
    if (canvasRef.current) {
      canvasRef.current.style.display = "";
    }
  }, []);

  const run = useCallback(
    (
      code: string,
      currentParams: ParamValues,
      resetState = true, // de functie geeft altijd één van deze dingen mee: error als er iets fout is en null als het goed is
    ): Error | null => {
      //eerst stopt het de vorige animatie en wordt de timer op 0 gezet, haalt de canvas context op en de width en height van het canvas
      stop();
      tRef.current = 0;
      if (resetState) stateRef.current = {};

      const canvas = canvasRef.current;
      if (!canvas) return null;

      const W = canvas.width;
      const H = canvas.height;

      if (sketch.useP5) {
        // haalt html element op, als er geen element is stopt de functie
        const container = canvas.parentElement;
        if (!container) return null;
        // verbergt het originele react canvas element want p5.js maakt zelf een nieuw canvas aan binnen de container
        // > voor 3D bijvoorbeeld
        canvas.style.display = "none";

        try {
          // splitst namen van paramteres van waardes
          const paramKeys = Object.keys(currentParams);
          const paramVals = Object.values(currentParams);

          // Maakt een JavaScript-functie aan van de gebruikerscode (een string)
          // De parameters p, W, H, t, mouse, state en de sketch-params worden als argumenten meegegeven zodat
          // de gebruiker die gewoon kan gebruiken in zijn code. p is hier het p5-object waarmee je kan tekenen.
          const fn = new Function(
            "p",
            "W",
            "H",
            "t",
            "mouse",
            "state",
            // "System",
            // "Particle",
            ...paramKeys,
            code,
          );

          // hier wordt een nieuwe p5 instantie aangemaakt, hierdoor kan je dus alles van p5-functies met 'p' aanroepen
          p5Ref.current = new p5((p: p5) => {
            p.setup = () => {
              // als het 3D is, voeg er dan WEBGL aantoe bij createCanvas
              const renderer = sketch.id === "grid3d" ? p.WEBGL : undefined;
              // als renderer niet undefined is dan moet die met de tweede optie gaan,
              // anders moet die renderer meenemen als argument in createCanvas
              const c = renderer
                ? p.createCanvas(p.windowWidth, p.windowHeight, renderer)
                : p.createCanvas(p.windowWidth, p.windowHeight);
              // Dit plaatst het p5-canvas binnenin de container div van React
              c.parent(container);
              // als het 3D is, zegt de vierkanten dan in het midden en zet de hoeken in graden
              p.angleMode(p.DEGREES);
              p.rectMode(p.CENTER);
            };

            p.draw = () => {
              mouseRef.current = {
                x: p.mouseX,
                y: p.mouseY,
                down: mouseRef.current.down,
              };
              // roept de gebruikerscode op met alle nodige elementen
              fn(
                p,
                p.width,
                p.height,
                tRef.current,
                mouseRef.current,
                stateRef.current,
                // System,
                // Particle,
                ...paramVals,
              );
              // verhoogt elke keer de framecount
              tRef.current++;
            };

            p.mousePressed = () => {
              mouseRef.current.down = true;
            };
            p.mouseReleased = () => {
              mouseRef.current.down = false;
            };
          });
        } catch (e) {
          // Als er iets fout gaat bij het aanmaken van p5 of de functie (bv. een fout in de gebruikerscode), wordt de fout teruggegeven
          // Als alles goed gaat, geeft de functie null terug
          return e instanceof Error ? e : new Error(String(e));
        }
        return null;
      }

      // als useP5 false is dan gaat die verder met het bouwen van een 2D canvas
      const ctx = canvas.getContext("2d");
      if (!ctx) return null;

      // Achtergrond eenmalig tekenen voor de drawing sketch
      if (sketch.id === "drawing") {
        ctx.fillStyle = "#0e0e10";
        ctx.fillRect(0, 0, W, H);
      }

      try {
        const paramKeys = Object.keys(currentParams);
        const paramVals = Object.values(currentParams);

        // sketch.animate komt van interface in sketches.ts
        // als de sketch geanimeert is dan wordt er een loop gemaakt, zo niet, dan wordt die één keer uitgevoerd
        if (sketch.animate) {
          const loop = () => {
            try {
              // door dit te definiëren heeft de gebruiker toegang tot deze parameters
              const fn = new Function(
                //Omdat de gebruikerscode op het canvas wil tekenen, maar geen directe toegang heeft tot de React refs. Door ctx als parameter mee te geven, kan de gebruiker gewoon schrijven ctx.fillStyle = 'blue'
                "ctx",
                "W",
                "H",
                // t = tijd of frames van de animaties
                // Elke frame stijgt t met 1, zodat de gebruikerscode beweging kan maken op basis van t.
                "t",
                "mouse",
                "state",
                ...paramKeys,
                code,
              );
              fn(
                ctx,
                W,
                H,
                tRef.current,
                mouseRef.current,
                stateRef.current,
                ...paramVals,
              );
              tRef.current++;
              animRef.current = requestAnimationFrame(loop);
            } catch (e) {
              console.error(e);
            }
          };
          loop();
        } else {
          const fn = new Function(
            "ctx",
            "W",
            "H",
            "t",
            "mouse",
            "state",
            ...paramKeys,
            code,
          );
          fn(ctx, W, H, 0, mouseRef.current, stateRef.current, ...paramVals);
        }
        return null;
      } catch (e) {
        //Dit vangt fouten op bij het aanmaken of uitvoeren van de functie (bv. een syntax error in de gebruikerscode). De reden voor deze constructie is dat je in JavaScript van alles kunt gooien met throw
        return e instanceof Error ? e : new Error(String(e));
      }
    },
    [canvasRef, sketch, stop],
  );

  // dit dient om de muisbewegingen bij te houden, zodat de gebruiker met de eenvoudige 'mousemove' 'mouseup' 'mousedown', de muis in interacties kunnen gebruiken.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        // je doet maal canvas.width/rect.width want >>> corrigeert als het canvas via CSS groter/kleiner weergegeven wordt dan zijn echte pixelgrootte
        x: (e.clientX - rect.left) * (canvas.width / rect.width),
        y: (e.clientY - rect.top) * (canvas.height / rect.height),
        down: mouseRef.current.down,
      };
    };
    const onDown = () => {
      mouseRef.current.down = true;
    };
    const onUp = () => {
      mouseRef.current.down = false;
    };

    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mousedown", onDown);
    canvas.addEventListener("mouseup", onUp);

    return () => {
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mousedown", onDown);
      canvas.removeEventListener("mouseup", onUp);
    };
  }, [canvasRef]);

  useEffect(() => {
    return () => stop();
  }, [stop]);

  return { run, stop };
}
