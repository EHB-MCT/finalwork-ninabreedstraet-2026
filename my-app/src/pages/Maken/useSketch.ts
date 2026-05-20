import { useEffect, useRef, useCallback } from "react";
import type { Sketch, ParamValues } from "./sketches";

interface MousePos {
  x: number;
  y: number;
  down: boolean;
}

export function useSketch(
  canvasRef: React.RefObject<HTMLCanvasElement>,
  sketch: Sketch,
  params: ParamValues,
) {
  const animRef = useRef<number | null>(null);
  const tRef = useRef<number>(0);
  const stateRef = useRef<Record<string, unknown>>({});
  const mouseRef = useRef<MousePos>({ x: 0, y: 0, down: false });

  const stop = useCallback(() => {
    if (animRef.current !== null) {
      cancelAnimationFrame(animRef.current);
      animRef.current = null;
    }
  }, []);

  const run = useCallback(
    (
      code: string,
      currentParams: ParamValues,
      resetState = true,
    ): Error | null => {
      stop();
      tRef.current = 0;
      if (resetState) stateRef.current = {};

      const canvas = canvasRef.current;
      if (!canvas) return null;

      const ctx = canvas.getContext("2d");
      if (!ctx) return null;

      const W = canvas.width;
      const H = canvas.height;

      // Achtergrond eenmalig tekenen voor de drawing sketch
      if (sketch.id === "drawing") {
        ctx.fillStyle = "#0e0e10";
        ctx.fillRect(0, 0, W, H);
      }

      try {
        const paramKeys = Object.keys(currentParams);
        const paramVals = Object.values(currentParams);

        // sketch.animate komt van interface in sketches.ts
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
