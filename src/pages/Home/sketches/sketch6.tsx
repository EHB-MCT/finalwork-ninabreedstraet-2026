//Bronnen:
// - https://www.youtube.com/watch?v=tRU_MtSzDBk

import { useEffect, useRef } from "react";
import p5 from "p5";

export default function Sketch6() {
  const sketchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let p5Instance: p5;
    let spacing = 25;
    let number: p5.Element;
    let divider: p5.Element;

    if (!sketchRef.current) return;

    const sketch = (p: p5) => {
      p.setup = () => {
        const canvas = p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL);
        p.noStroke();
        p.textureMode(p.IMAGE);

        canvas.parent(sketchRef.current!);
        number = p.createSlider(1, 15, 5);
        number.position(10, 10);
        number.size(80);

        divider = p.createSlider(1, 15, 5, 0.5);
        divider.position(200, 10);
        divider.size(80);
      };

      p.draw = () => {
        let num = number.value() as number;
        let d = divider.value() as number;
        p.background(220);

        p.orbitControl();

        for (let i = 0; i < num; i++) {
          for (let j = 0; j < num; j++) {
            for (let k = 0; k < num; k++) {
              p.push();
              let offset = (-spacing * num) / 2 + spacing / 2;
              let x = i * spacing + offset;
              let y = j * spacing + offset;
              let z = k * spacing + offset;
              let distance = p.sqrt(p.pow(x, 2) + p.pow(y, 2) + p.pow(z, 2));
              p.translate(x, y, z);
              p.normalMaterial();
              let sphereSize = spacing - distance / d;
              p.sphere(sphereSize, 6, 6);
              p.texture("");
              p.pop();
            }
          }
        }
      };
    };
    p5Instance = new p5(sketch);
    return () => p5Instance.remove();
  }, []);

  return (
    <div style={{ display: "inline-block" }}>
      <div ref={sketchRef} />
    </div>
  );
}
