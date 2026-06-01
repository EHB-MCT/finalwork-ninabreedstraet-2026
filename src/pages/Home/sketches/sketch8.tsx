import { useEffect, useRef } from "react";
import p5 from "p5";

export default function Sketch8() {
  const sketchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sketchRef.current) return;

    const sketch = (p: p5) => {
      let bubbles: Bubble[] = [];
      let field: number[][] = [];
      let rez = 10;
      let cols: number;
      let rows: number;

      // Three random anchor colors, refreshed on every reload
      let gradientColors: [number, number, number][] = [];

      const thresholds = [0.3, 0.6, 1.0, 1.5, 2.2, 3.2, 4.5];

      function randomColor(): [number, number, number] {
        return [p.random(30, 230), p.random(30, 230), p.random(30, 230)];
      }

      // Interpolate across 3 colors: c0 → c1 at t=0.5, c1 → c2 at t=1.0
      function gradientAt(t: number): [number, number, number] {
        const [c0, c1, c2] = gradientColors;
        if (t <= 0.5) {
          const s = t / 0.5;
          return [
            p.lerp(c0[0], c1[0], s),
            p.lerp(c0[1], c1[1], s),
            p.lerp(c0[2], c1[2], s),
          ];
        } else {
          const s = (t - 0.5) / 0.5;
          return [
            p.lerp(c1[0], c2[0], s),
            p.lerp(c1[1], c2[1], s),
            p.lerp(c1[2], c2[2], s),
          ];
        }
      }

      class Bubble {
        x: number;
        y: number;
        r: number;
        vx: number;
        vy: number;
        isMouseBubble: boolean;

        constructor(isMouseBubble = false) {
          this.isMouseBubble = isMouseBubble;
          this.x = p.random(p.width);
          this.y = p.random(p.height);
          this.r = p.random(10, 150);
          this.vx = p.random(-2, 2);
          this.vy = p.random(-2, 2);
        }

        update() {
          if (this.isMouseBubble) {
            this.x += (p.mouseX - this.x) * 0.1;
            this.y += (p.mouseY - this.y) * 0.1;
          } else {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > p.width) this.vx *= -1;
            if (this.y < 0 || this.y > p.height) this.vy *= -1;
          }
        }
      }

      function drawLine(v1: p5.Vector, v2: p5.Vector) {
        p.line(v1.x, v1.y, v2.x, v2.y);
      }

      function getState(a: number, b: number, c: number, d: number) {
        return a * 8 + b * 4 + c * 2 + d * 1;
      }

      function marchingSquares(threshold: number) {
        for (let i = 0; i < cols - 1; i++) {
          for (let j = 0; j < rows - 1; j++) {
            let x = i * rez;
            let y = j * rez;
            let a = p.createVector(x + rez * 0.5, y);
            let b = p.createVector(x + rez, y + rez * 0.5);
            let c = p.createVector(x + rez * 0.5, y + rez);
            let d = p.createVector(x, y + rez * 0.5);

            let c1 = field[i][j] < threshold ? 0 : 1;
            let c2 = field[i + 1][j] < threshold ? 0 : 1;
            let c3 = field[i + 1][j + 1] < threshold ? 0 : 1;
            let c4 = field[i][j + 1] < threshold ? 0 : 1;
            let state = getState(c1, c2, c3, c4);

            switch (state) {
              case 1:
                drawLine(c, d);
                break;
              case 2:
                drawLine(b, c);
                break;
              case 3:
                drawLine(b, d);
                break;
              case 4:
                drawLine(a, b);
                break;
              case 5:
                drawLine(a, d);
                drawLine(b, c);
                break;
              case 6:
                drawLine(a, c);
                break;
              case 7:
                drawLine(a, d);
                break;
              case 8:
                drawLine(a, d);
                break;
              case 9:
                drawLine(a, c);
                break;
              case 10:
                drawLine(a, b);
                drawLine(c, d);
                break;
              case 11:
                drawLine(a, b);
                break;
              case 12:
                drawLine(b, d);
                break;
              case 13:
                drawLine(b, c);
                break;
              case 14:
                drawLine(c, d);
                break;
            }
          }
        }
      }

      p.setup = () => {
        const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
        canvas.parent(sketchRef.current!);

        cols = Math.floor(1 + p.width / rez);
        rows = Math.floor(1 + p.height / rez);
        field = Array.from({ length: cols }, () => new Array(rows).fill(0));

        // Generate 3 random anchor colors once per session
        gradientColors = [randomColor(), randomColor(), randomColor()];

        bubbles.push(new Bubble(true));
        for (let i = 0; i < 15; i++) {
          bubbles.push(new Bubble(false));
        }
      };

      p.draw = () => {
        p.background(200, 210, 220);

        for (let b of bubbles) b.update();

        for (let i = 0; i < cols; i++) {
          for (let j = 0; j < rows; j++) {
            let sum = 0;
            let x = i * rez;
            let y = j * rez;
            for (let b of bubbles) {
              let dx = x - b.x;
              let dy = y - b.y;
              sum += (b.r * b.r) / (dx * dx + dy * dy);
            }
            field[i][j] = sum;
          }
        }

        // Alleen strokes, geen fill
        p.strokeWeight(6);
        p.noFill();
        for (let k = 0; k < thresholds.length - 2; k++) {
          const t = k / (thresholds.length - 1);
          const col = gradientAt(t);
          p.stroke(col[0], col[1], col[2]);
          marchingSquares(thresholds[k]);
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
