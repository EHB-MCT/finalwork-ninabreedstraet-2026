// Bron:
// https://www.youtube.com/watch?v=ktPnruyC6cc

import { useEffect, useRef } from "react";
import p5 from "p5";

export default function Sketch10() {
  const sketchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sketchRef.current) return;

    const sketch = (p: p5) => {
      p.setup = () => {
        const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
        canvas.parent(sketchRef.current!);
        p.angleMode(p.DEGREES);
        p.rectMode(p.CENTER);
      };

      p.draw = () => {
        p.background(10, 20, 30);
        p.noFill();
        p.translate(p.width / 2, p.height / 2);
        for (let i = 0; i < 100; i++) {
          for (let j = 0; j < 100; j++) {
            p.push();
            p.rotate(p.sin(p.frameCount + i) * 100);
            let r = p.map(p.sin(p.frameCount), -1, 1, 50, 255);
            let g = p.map(p.cos(p.frameCount / 2), -1, 1, 50, 255);
            let b = p.map(p.sin(p.frameCount / 4), -1, 1, 50, 255);
            p.strokeWeight(p.map(i, 0, 100, 4, 0.2));
            p.stroke(r, g, b);
            const size =
              p.max(p.width, p.height) * 2 -
              i * ((p.max(p.width, p.height) * 2) / 100);
            p.rect(0, 0, size, size, 200 - i * 2);
            p.pop();
          }
        }
      };
    };

    const p5Instance = new p5(sketch);
    return () => p5Instance.remove();
  }, []);

  return (
    <div style={{ display: "inline-block" }}>
      <div ref={sketchRef} />
    </div>
  );
}
