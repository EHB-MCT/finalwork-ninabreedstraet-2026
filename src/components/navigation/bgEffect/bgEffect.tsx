import { useState, useEffect, useRef } from "react";
import p5 from "p5";
import style from "./bgEffect.module.scss";

const PALETTES = {
  Dawn: [
    "#fde8d8",
    "#feb3b3",
    "#dca2a8",
    "#fce4c8",
    "#d6a5ad",
    "#fce8b2",
    "#e8d5f5",
  ],
  Mint: [
    "#c8f0e8",
    "#b8e8f8",
    "#d0f0d8",
    "#97d9ce",
    "#c8f0d8",
    "#a9edba",
    "#b0e8f0",
  ],
  Lilac: [
    "#e8d8f8",
    "#ddd0f8",
    "#f0d8f0",
    "#a095c3",
    "#e0c8f8",
    "#f0d0f8",
    "#a6a3c5",
  ],
  Peach: [
    "#fde8cc",
    "#fad8b8",
    "#f1c899",
    "#f8d0b8",
    "#fce8b8",
    "#fad0b0",
    "#eaae73",
  ],
};

// dit laat alleen Dawn, Peach, Lilac of Mint toelaat
type PaletteName = keyof typeof PALETTES;

const PALETTE_PREVIEW: Record<PaletteName, string> = {
  Dawn: "#fde8d8",
  Mint: "#c8f0e8",
  Lilac: "#e8d8f8",
  Peach: "#fde8cc",
};

export function BgEffect() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<PaletteName>("Dawn");
  const p5InstanceRef = useRef<p5 | null>(null);

  useEffect(() => {
    // elke keer als de kleur veranderd wordt de vorige p5-instantie verwijderd
    p5InstanceRef.current?.remove();

    // kijken welk palette actief is door state te bekijken
    const palette = PALETTES[active];

    const sketch = (p: p5) => {
      // snelheid en size van de cirkels
      const SPEED = 0.0012;
      const BLOB_SIZE = 420;

      // dit betekent: dit is een array van objecten met deze vorm en dit is een lege array
      let blobs: {
        // dit is de kleur
        col: [number, number, number];
        // dit is de positie
        ox: number;
        oy: number;
        ot: number;
      }[] = [];
      // dit is de tijd
      let t = 0;

      // Dit zorgt ervoor dat de hex-kleurcode een rgb-kleurcode wordt
      // daarna parsen we het naar een getal
      function hexToRgb(hex: string): [number, number, number] {
        return [
          parseInt(hex.slice(1, 3), 16),
          parseInt(hex.slice(3, 5), 16),
          parseInt(hex.slice(5, 7), 16),
        ];
      }

      p.setup = () => {
        const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
        // Zet canvas achter alles
        canvas.style("position", "fixed");
        canvas.style("top", "0");
        canvas.style("left", "0");
        canvas.style("z-index", "-1");
        p.noStroke();

        // hier mappen over de palette > dat is de actieve palette die de gebruiker heeft aangeduid
        blobs = palette.map((col) => ({
          col: hexToRgb(col),
          ox: p.random(1000),
          oy: p.random(1000),
          ot: p.random(1000),
        }));
      };

      p.draw = () => {
        // zorgen dat animatie verder gaat > tijd + snelheid
        t += SPEED;
        p.background(255, 248, 245);

        for (const b of blobs) {
          // via perlin noise waardes krijgen voor de plaats: dit is vloeiender/organischer dan de gewone random() functie
          // -BLOB_SIZE en +BLOB_SIZE zodat de overgangen mooi zijn en niet stoppen bij de randen van het scherm
          const x = p.map(
            p.noise(b.ox + t * 0.7),
            0,
            1,
            -BLOB_SIZE,
            p.width + BLOB_SIZE,
          );
          const y = p.map(
            p.noise(b.oy + t * 0.5),
            0,
            1,
            -BLOB_SIZE,
            p.height + BLOB_SIZE,
          );
          // blobs pulseren ook een beetje, met offset ot (random getal tussen 0 en 1000) en snelheid wordt ook vergtraagt
          const r =
            BLOB_SIZE +
            p.map(
              p.noise(b.ot + t * 0.3),
              0,
              1,
              -BLOB_SIZE * 0.3,
              BLOB_SIZE * 0.3,
            );

          // hier zeg je dat de col van elke blob bestaat uit de variabelen cr, cg, cb
          // via de functie hexToRgb() heb je het actieve palette en die waardes die je daaruit haalde,
          // worden dus hier uit elkaar getrokkken
          const [cr, cg, cb] = b.col;
          const ctx = p.drawingContext as CanvasRenderingContext2D;
          // gradient maken door x, y positie te gebruiken + de straal
          const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
          // kleur toevoegen aan de gradient met rgb waardes
          grad.addColorStop(0, `rgba(${cr},${cg},${cb},0.85)`);
          grad.addColorStop(0.4, `rgba(${cr},${cg},${cb},0.45)`);
          grad.addColorStop(1, `rgba(${cr},${cg},${cb},0)`);

          ctx.fillStyle = grad;
          // dit zegt: begin een nieuw pad, ander zijn er ongewenste overlappingen ofzo
          ctx.beginPath();
          // cirkel tekenen met grad als vulling
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fill();
        }
      };

      p.windowResized = () => p.resizeCanvas(p.windowWidth, p.windowHeight);
    };

    // Mount direct op body zodat de canvas zeker buiten je app-container valt
    p5InstanceRef.current = new p5(sketch, document.body);

    return () => {
      p5InstanceRef.current?.remove();
    };
  }, [active]);

  return (
    <div className={style.wrapper}>
      {open && <div className={style.overlay} onClick={() => setOpen(false)} />}

      <div className={style.floaterBox}>
        <div className={style.floater} onClick={() => setOpen((v) => !v)}>
          <span
            className={style.activeSwatch}
            style={{ backgroundColor: PALETTE_PREVIEW[active] }}
          />
          ▾
        </div>

        {open && (
          <div className={style.dropdown}>
            {(Object.keys(PALETTES) as PaletteName[]).map((name) => (
              <button
                key={name}
                className={`${style.dropdownItem} ${active === name ? style.dropdownItemActive : ""}`}
                onClick={() => {
                  setActive(name);
                  setOpen(false);
                }}
              >
                {name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
