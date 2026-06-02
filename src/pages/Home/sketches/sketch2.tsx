//Bronnen:
// - https://www.youtube.com/watch?v=4IyeLc6J1Uo

import { useEffect, useRef } from "react";
import p5 from "p5";

let img: p5.Image | null = null;
let isLoaded = false;

export default function Sketch2() {
  // verwijst naar div element waar p5 zijn sketch in gaat zetten
  const sketchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let p5Instance: p5;
    if (!sketchRef.current) return;

    const sketch = (p: p5) => {
      // Dit zijn de instellingen van de visual
      let asciiChar = "█▓▒░ ";

      let cols = 250;
      let cellW = 0;
      let rows = 0;

      // "█▓▒░ ";
      // "#$%&*+=−:;,. ";
      // "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\|()1{}[]?-_+~<>i!lI;:,^`'. ";

      let size = 6;
      // let charWidth = size; // wordt hieronder overschreven na font-load

      p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);

        // Stel font in vóór meting
        p.textSize(size);
        p.textFont("/Fonts/Helvetica.ttf");
        p.textAlign(p.LEFT, p.TOP);
        p.noLoop();

        cellW = p.width / cols;
        rows = Math.floor(p.height / cellW);

        // Eerst de afbeelding laden, dan pas canvas aanmaken met de juiste grootte
        p.loadImage("/Images/natuur.jpeg", (loaded) => {
          img = loaded;
          isLoaded = true;

          img.resize(cols, rows);

          p.redraw();
        });
      };

      p.draw = () => {
        if (!isLoaded || !img) return;
        p.fill(1);
        p.background(255);
        img.loadPixels();

        for (let i = 0; i < img.width; i++) {
          for (let j = 0; j < img.height; j++) {
            let pixelsIndex = (i + j * img.width) * 4;
            let r = img.pixels[pixelsIndex + 0];
            let g = img.pixels[pixelsIndex + 1];
            let b = img.pixels[pixelsIndex + 2];

            let bright = (r + g + b) / 3;
            let tIndex = p.floor(
              p.map(bright, 0, 255, 0, asciiChar.length - 1),
            );

            let x = i * cellW;
            let y = j * cellW;
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
