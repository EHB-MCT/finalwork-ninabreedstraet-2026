//Bronnen:
// - https://openprocessing.org/@u537625/2691712#code
// - https://openprocessing.org/@u183615/2225285#code
// - https://openprocessing.org/@u436301/2218758#code
// - https://openprocessing.org/@u437419/2225939#code

import { useEffect, useRef, useState } from "react";
import p5 from "p5";
// opentype >> kan letters omzetten naar paden en vormen die je kan gebruiken
import * as opentype from "opentype.js";

const FONT_URL = "/Fonts/Helvetica.ttf";

export default function Sketch1() {
  // verwijst naar div element waar p5 zijn sketch in gaat zetten
  const sketchRef = useRef<HTMLDivElement>(null);

  // dit is het woord dat de mensen gaan intikken
  const [word, setWord] = useState("HELLO");

  // wordRef is een ref-kopie van word.
  // Dit is nodig omdat p5 draait in een eigen scope en geen toegang heeft tot de nieuwste React state, via een ref wel.
  const wordRef = useRef(word);

  // woord ophalen
  useEffect(() => {
    wordRef.current = word;
  }, [word]);

  useEffect(() => {
    let p5Instance: p5;
    let loadedFont: opentype.Font | null = null;

    // hier wordt het woord omgezet in een pad door opentype
    fetch(FONT_URL)
      .then((res) => res.arrayBuffer())
      .then((buffer) => {
        loadedFont = opentype.parse(buffer);
      })
      .catch((err) => console.error("Font laden mislukt:", err));

    const sketch = (p: p5) => {
      // Dit zijn de instellingen van de visual
      const SPACING = 3;
      const FONT_SIZE = 190;
      const MOUSE_RADIUS = 80;
      const MAX_GROW = 26;
      const LERP_SPEED = 0.15;

      // baseR is de basis grootte en r is de huidige straal die geüpdatet wordt
      let dots: { x: number; y: number; baseR: number; r: number }[] = [];
      let currentWord = "";

      function buildDots(targetWord: string) {
        dots = [];
        if (!loadedFont || !targetWord.trim()) return;

        const W = p.width;
        const H = p.height;

        // hier wordt het woord onzichtbaar getekend op een 'off-screen' canvas
        const offscreen = document.createElement("canvas");
        offscreen.width = W;
        offscreen.height = H;
        const ctx = offscreen.getContext("2d")!;
        ctx.clearRect(0, 0, W, H);

        const path = loadedFont.getPath(
          targetWord.toUpperCase(),
          0,
          0,
          FONT_SIZE,
        );
        // plaatsing en breedte en hoogte van het woord bb is dus het path van het woord
        const bb = path.getBoundingBox();
        const tw = bb.x2 - bb.x1; // width
        const th = bb.y2 - bb.y1; // height
        const ox = (W - tw) / 2 - bb.x1; // x-plaats
        const oy = (H - th) / 2 - bb.y1; // y-plaats

        ctx.save();
        ctx.translate(ox, oy);
        ctx.fillStyle = "#fff";
        path.draw(ctx);
        ctx.restore();

        // hier worden de pixels uitgelezen, ctx krijgt dus de contact van wat er op de sketch staat
        const imgData = ctx.getImageData(0, 0, W, H).data;

        for (let y = SPACING / 2; y < H; y += SPACING) {
          for (let x = SPACING / 2; x < W; x += SPACING) {
            const idx = (Math.round(y) * W + Math.round(x)) * 4;
            // zet witte pixels om naar cirkels
            if (imgData[idx + 3] > 128) {
              dots.push({ x, y, baseR: 2.5, r: 2.5 });
            }
          }
        }
      }

      p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);
        p.frameRate(60);
      };

      p.draw = () => {
        if (loadedFont && currentWord === "") {
          currentWord = wordRef.current;
          buildDots(currentWord);
        }

        if (wordRef.current !== currentWord && loadedFont) {
          currentWord = wordRef.current;
          buildDots(currentWord);
        }

        p.background(17);

        for (const d of dots) {
          const dx = d.x - p.mouseX;
          const dy = d.y - p.mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const influence = Math.max(0, 1 - dist / MOUSE_RADIUS);
          const targetR = d.baseR + influence * MAX_GROW;
          d.r += (targetR - d.r) * LERP_SPEED;

          // groene-glow kleur gebaseerd op de groote van de stip
          const glow = d.r / (d.baseR + MAX_GROW);
          const r = Math.round(80 + glow * 170);
          const g = Math.round(180 + glow * 75);
          const b = Math.round(50 + glow * 50);

          p.noStroke();
          p.fill(r, g, b);
          p.circle(d.x, d.y, Math.max(1, d.r) * 2);
        }
      };

      // als scherm kleiner word gemaakt dan wordt resizeCanvas aangeroepen (functie van p5)
      p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
        setTimeout(() => {
          if (loadedFont) buildDots(currentWord);
        }, 0);
      };
    };

    p5Instance = new p5(sketch, sketchRef.current!);
    return () => p5Instance.remove();
  }, []);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <div ref={sketchRef} />
      <input
        type="text"
        value={word}
        maxLength={15}
        onChange={(e) => setWord(e.target.value)}
        onKeyDown={(e) => e.stopPropagation()}
        onKeyUp={(e) => e.stopPropagation()}
        style={{
          position: "absolute",
          bottom: "16px",
          left: "50%",
          transform: "translateX(-50%)",
          fontSize: "16px",
          padding: "6px 14px",
          borderRadius: "8px",
          border: "1px solid rgba(255,255,255,0.2)",
          background: "rgba(255,255,255,0.08)",
          color: "#fff",
          textAlign: "center",
          width: "220px",
          outline: "none",
          backdropFilter: "blur(6px)",
          zIndex: 10,
        }}
        placeholder="Typ een woord..."
      />
    </div>
  );
}
