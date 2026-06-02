//Bronnen:
// - https://www.youtube.com/watch?v=4IyeLc6J1Uo

import { useEffect, useRef } from "react";
import p5 from "p5";

let img: p5.Image;

export default function Sketch2() {
  // verwijst naar div element waar p5 zijn sketch in gaat zetten
  const sketchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let p5Instance: p5;
    if (!sketchRef.current) return;

    const sketch = (p: p5) => {
      // Dit zijn de instellingen van de visual
      let asciiChar = "█▓▒░ ";

      // "█▓▒░ ";
      // "#$%&*+=−:;,. ";
      // "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\|()1{}[]?-_+~<>i!lI;:,^`'. ";

      let size = 6;
      let charWidth = size; // wordt hieronder overschreven na font-load

      p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);

        // Stel font in vóór meting
        p.textSize(size);
        p.textFont("/Fonts/Helvetica.ttf");
        p.textAlign(p.LEFT, p.TOP);
        p.noLoop();

        // Laad eerst de afbeelding, dan pas canvas aanmaken met de juiste grootte
        img = p.loadImage("/Images/natuur.jpeg", (loaded) => {
          img = loaded;
          img.resize(300, 0);

          // Meet de werkelijke tekenbreedte ná font-load
          charWidth = p.textWidth("M");

          const canvasWidth = img.width * size;
          const canvasHeight = img.height * size;
          p.resizeCanvas(canvasWidth, canvasHeight);

          // Reset de inline stijl die p5 zet
          const canvasEl = document.querySelector(
            "canvas",
          ) as HTMLCanvasElement;
          canvasEl.style.width = "";
          canvasEl.style.height = "";

          p.redraw();
        });
      };

      p.draw = () => {
        if (!img) return;
        p.fill(1);
        p.background(500);
        img.loadPixels();

        for (let i = 0; i < img.width; i++) {
          for (let j = 0; j < img.height; j++) {
            let pixelsIndex = (i + j * img.width) * 4;
            let r = img.pixels[pixelsIndex + 0];
            let g = img.pixels[pixelsIndex + 1];
            let b = img.pixels[pixelsIndex + 2];

            let bright = (r + g + b) / 3;
            let tIndex = p.floor(p.map(bright, 0, 100, 0, asciiChar.length));

            let x = i * charWidth + charWidth / 2;
            let y = j * charWidth + charWidth / 2;
            p.textSize(size);
            p.textAlign(p.CENTER, p.CENTER);
            p.text(asciiChar.charAt(tIndex), x, y);
          }
        }
      };
    };
    p5Instance = new p5(sketch, sketchRef.current!);
    return () => p5Instance.remove();
  }, []);

  return (
    <div style={{ display: "inline-block", color: "black" }}>
      <div
        ref={sketchRef}
        style={{
          lineHeight: 0,
        }}
      />
      <style>{`
      canvas {
        width: auto !important;
        height: auto !important;
        display: block;
      }
    `}</style>
    </div>
  );
}
