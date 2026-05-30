//Bronnen:
// - https://www.youtube.com/watch?v=fm78lZzW2hU

import { useEffect, useRef } from "react";
import p5 from "p5";

export default function Sketch8() {
  const sketchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let p5Instance: p5;
    let img: p5.Image;
    let cols: number, rows: number;
    let size = 20;
    let tiles: p5.Image[][] = [];
    let mode = 4;

    if (!sketchRef.current) return;

    const sketch = (p: p5) => {
      let imgLoaded = false;

      p.setup = () => {
        const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
        canvas.parent(sketchRef.current!);
        cols = p.width / size;
        rows = p.height / size;
        p.loadImage("/Images/natuur.jpeg", (loadedImg) => {
          img = loadedImg;
          img.resize(p.windowWidth, 0);
          imgLoaded = true;
          cols = p.width / size;
          rows = p.height / size;

          for (let i = 0; i < cols; i++) {
            tiles[i] = [] as p5.Image[];
            for (let j = 0; j < rows; j++) {
              tiles[i][j] = img.get(i * size, j * size, size, size);
            }
          }
        });

        // p.redraw();
      };

      p.draw = () => {
        if (!imgLoaded) return;
        for (let i = 0; i < cols; i++) {
          for (let j = 0; j < rows; j++) {
            let x = i * size;
            let y = j * size;
            p.push();
            p.translate(x, y);

            if (mode === 0) {
              if (imgLoaded) {
                p.image(tiles[i][j], 0, 0);
              }
            } else if (mode === 1) {
              if (imgLoaded) {
                p.scale(-1, 1);
                p.image(tiles[i][j], -size, 0);
              }
            } else if (mode === 2) {
              if (imgLoaded) {
                p.scale(1, -1);
                p.image(tiles[i][j], 0, -size);
              }
            } else if (mode === 3) {
              if (imgLoaded) {
                p.scale(-1, -1);
                p.image(tiles[i][j], -size, -size);
              }
            } else if (i > p.mouseX / size) {
              p.translate(size / 2, size / 2);
              let angle = (p.floor(p.random(4)) * p.PI) / 2;
              p.rotate(angle);
              p.image(tiles[i][j], -size / 2, -size / 2);
            } else {
              p.image(tiles[i][j], 0, 0);
            }

            p.pop();
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
