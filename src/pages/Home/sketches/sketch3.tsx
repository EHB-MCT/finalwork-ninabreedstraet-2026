//Bronnen:
// - https://www.youtube.com/watch?v=AVMSCFMCz9w&t=328s

import { useEffect, useRef } from "react";
import p5 from "p5";

export default function Sketch3() {
  // verwijst naar div element waar p5 zijn sketch in gaat zetten
  const sketchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let p5Instance: p5;
    if (!sketchRef.current) return;

    const sketch = (p: p5) => {
      // Dit zijn de instellingen van de visual
      let cols: number;
      let rows: number;
      let spacing = 60;
      let size: number[][] = [];
      let scale = 0.7;

      p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);
        p.rectMode(p.CENTER);
        cols = Math.floor(p.width / spacing);
        rows = Math.floor(p.height / spacing);
      };

      p.draw = () => {
        p.background(0);
        for (let i = 0; i < cols; i++) {
          size[i] = [];
          for (let j = 0; j < rows; j++) {
            size[i][j] = p.min(
              p.dist(
                p.mouseX,
                p.mouseY,
                spacing / 8 + i * spacing,
                spacing / 8 + j * spacing,
              ) * scale,
              60,
            );
          }
        }

        for (let i = 0; i < cols; i++) {
          for (let j = 0; j < rows; j++) {
            p.stroke(20, 20, 20);
            p.rect(
              spacing / 2 + i * spacing,
              spacing / 2 + j * spacing,
              size[i][j],
              size[i][j],
              15,
              15,
              15,
              15,
            );
          }
        }
      };
    };
    p5Instance = new p5(sketch, sketchRef.current!);
    return () => p5Instance.remove();
  }, []);

  return (
    <div style={{ display: "inline-block" }}>
      <div ref={sketchRef} />
    </div>
  );
}
