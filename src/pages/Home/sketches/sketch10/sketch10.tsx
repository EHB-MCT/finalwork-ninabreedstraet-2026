// Bron:
// https://www.youtube.com/watch?v=QlpadcXok8U

import { useEffect, useRef } from "react";
import System from "./system";
import p5 from "p5";

export default function Sketch10() {
  const sketchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sketchRef.current) return;
    let ps: System[] = [];

    const sketch = (p: p5) => {
      p.setup = () => {
        const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
        canvas.parent(sketchRef.current!);
        p.colorMode(p.HSB, 255);
      };
      p.draw = () => {
        p.background(0);

        if (p.random() < 0.3) {
          ps.push(new System(p, p.mouseX, p.mouseY));
        }

        for (let i = ps.length - 1; i >= 0; i--) {
          ps[i].update();
          ps[i].display();

          if (ps[i].done) {
            ps.splice(i, 1);
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
