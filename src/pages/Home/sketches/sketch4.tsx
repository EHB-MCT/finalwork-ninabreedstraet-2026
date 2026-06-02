//Bronnen:
// - https://www.youtube.com/watch?v=lPgscmgxcH0

import { useEffect, useRef } from "react";
import p5 from "p5";

interface Circle {
  x: number;
  y: number;
  r: number;
  offsetX: number;
  offsetY: number;
}

const circles: Circle[] = [
  { x: 200, y: 200, r: 150, offsetX: 0, offsetY: 0 },
  { x: 500, y: 400, r: 180, offsetX: 0, offsetY: 0 },
  { x: 800, y: 200, r: 100, offsetX: 0, offsetY: 0 },
  { x: 1100, y: 200, r: 160, offsetX: 0, offsetY: 0 },
  { x: 800, y: 900, r: 160, offsetX: 0, offsetY: 0 },
  { x: 1300, y: 200, r: 360, offsetX: 0, offsetY: 0 },
  { x: 300, y: 900, r: 110, offsetX: 0, offsetY: 0 },
];

function setGradientBlock(
  p: p5,
  min: any,
  max: number,
  y: number,
  h: any,
  c1: p5.Color,
  c2: p5.Color,
) {
  for (let i = min; i <= max; i++) {
    let amt = p.map(i, min, max, 0, 1);
    let c3 = p.lerpColor(c1, c2, amt);
    p.stroke(c3);
    p.line(i, y, i, y + h);
  }
}

function getColorForPosition(
  p: p5,
  x: number,
  y: number,
  c1: p5.Color,
  c2: p5.Color,
  c3: p5.Color,
): [number, number, number] {
  // kleur op basis van x-positie
  let amt = p.map(x, 0, p.width, 0, 1);
  amt = p.constrain(amt, 0, 1);
  let col: p5.Color;
  if (amt < 0.5) {
    col = p.lerpColor(c1, c2, amt * 2);
  } else {
    col = p.lerpColor(c2, c3, (amt - 0.5) * 2);
  }
  return [p.red(col), p.green(col), p.blue(col)];
}

function drawBlurredCircle(
  p: p5,
  x: number,
  y: number,
  radius: number,
  color: [number, number, number],
) {
  const ctx = p.drawingContext as CanvasRenderingContext2D;

  ctx.save();
  ctx.filter = "blur(20px)";
  p.noStroke();
  p.fill(color[0], color[1], color[2], 200);
  p.ellipse(x, y, radius);
  ctx.restore();
}

function separateCircles(circles: Circle[]) {
  for (let i = 0; i < circles.length; i++) {
    for (let j = i + 1; j < circles.length; j++) {
      const a = circles[i];
      const b = circles[j];
      const ax = a.x + a.offsetX;
      const ay = a.y + a.offsetY;
      const bx = b.x + b.offsetX;
      const by = b.y + b.offsetY;

      const dx = bx - ax;
      const dy = by - ay;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const minDist = a.r + b.r;

      if (dist < minDist && dist > 0) {
        const overlap = (minDist - dist) / 2;
        const nx = dx / dist;
        const ny = dy / dist;
        a.offsetX -= nx * overlap;
        a.offsetY -= ny * overlap;
        b.offsetX += nx * overlap;
        b.offsetY += ny * overlap;
      }
    }
  }
}

export default function Sketch4() {
  const sketchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let p5Instance: p5;
    if (!sketchRef.current) return;

    const sketch = (p: p5) => {
      let c1: p5.Color;
      let c2: p5.Color;
      let c3: p5.Color;

      p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);
        p.rectMode(p.CENTER);
        c1 = p.color(p.random(255), p.random(255), p.random(255));
        c2 = p.color(p.random(255), p.random(255), p.random(255));
        c3 = p.color(p.random(255), p.random(255), p.random(255));
        p.angleMode(p.DEGREES);
      };

      p.draw = () => {
        p.background(220);

        setGradientBlock(p, 0, p.width / 4, 0, p.height, c1, c2);
        setGradientBlock(
          p,
          p.width / 4,
          (2 * p.width) / 4,
          0,
          p.height,
          c2,
          c3,
        );
        setGradientBlock(
          p,
          (2 * p.width) / 4,
          (3 * p.width) / 4,
          0,
          p.height,
          c3,
          c2,
        );
        setGradientBlock(p, (3 * p.width) / 4, p.width, 0, p.height, c2, c1);

        // muis effect
        for (let circle of circles) {
          circle.offsetX = p.lerp(
            circle.offsetX,
            (p.mouseX - circle.x) * 0.25,
            0.038,
          );
          circle.offsetY = p.lerp(
            circle.offsetY,
            (p.mouseY - circle.y) * 0.25,
            0.038,
          );
        }

        // cirkels uit elkaar houden
        separateCircles(circles);

        // cirkels tekenen met kleur op basis van positie
        for (let circle of circles) {
          const cx = circle.x + circle.offsetX;
          const cy = circle.y + circle.offsetY;
          const color = getColorForPosition(p, cx, cy, c1, c2, c3);
          drawBlurredCircle(p, cx, cy, circle.r, color);
        }

        // roterende gradiënt cirkel
        // p.push();
        // p.translate(p.width / 2, p.height / 2);
        // p.rotate(angle);
        // setGradientEllipse(p, 0, 90, c1, c2);
        // setGradientEllipse(p, 90, 180, c2, c3);
        // setGradientEllipse(p, 180, 270, c3, c2);
        // setGradientEllipse(p, 270, 360, c2, c1);
        // p.pop();

        // angle = startAngle + easeInQuad(amt) * 90;
        // if (amt > 1) {
        //   amt = 0;
        //   startAngle += 90;
        // } else {
        //   amt += 0.01;
        // }
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
