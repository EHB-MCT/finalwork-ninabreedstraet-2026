import { useEffect, useRef } from "react";
import p5 from "p5";

export default function Sketch() {
  const sketchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sketch = (p: p5) => {
      let tileCountX = 50;
      let tileCountY = 10;

      let hueValues: number[] = [];
      let saturationValues: number[] = [];
      let brightnessValues: number[] = [];

      p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);
        p.colorMode(p.HSB, 360, 100, 100, 100);
        p.noStroke();

        for (let i = 0; i < tileCountX; i++) {
          hueValues[i] = p.random(360);
          saturationValues[i] = p.random(100);
          brightnessValues[i] = p.random(100);
        }
      };

      p.draw = () => {
        p.background(0, 0, 100);

        let mX = p.constrain(p.mouseX, 0, p.width);
        let mY = p.constrain(p.mouseY, 0, p.height);

        let counter = 0;

        let currentTileCountX = p.int(p.map(mX, 0, p.width, 1, tileCountX));
        let currentTileCountY = p.int(p.map(mY, 0, p.height, 1, tileCountY));
        let tileWidth = p.width / currentTileCountX;
        let tileHeight = p.height / currentTileCountY;

        for (let gridY = 0; gridY < tileCountY; gridY++) {
          for (let gridX = 0; gridX < tileCountX; gridX++) {
            let posX = tileWidth * gridX;
            let posY = tileHeight * gridY;
            let index = counter % currentTileCountX;

            p.fill(
              hueValues[index],
              saturationValues[index],
              brightnessValues[index],
            );
            p.rect(posX, posY, tileWidth, tileHeight);
            counter++;
          }
        }
      };

      p.keyPressed = () => {
        if (p.key === "s" || p.key === "S")
          p.saveCanvas(`sketch_${Date.now()}`, "png");

        // Note: 'gd' library was removed. Use p.color() instead.
        // The ASE export functionality requires the generative-design library.
        if (p.key === "c" || p.key === "C") {
          let colors: p5.Color[] = [];
          for (let i = 0; i < hueValues.length; i++) {
            colors.push(
              p.color(hueValues[i], saturationValues[i], brightnessValues[i]),
            );
          }
          // p.saveJSON(colors, `colors_${Date.now()}`); // Alternative save
        }

        if (p.key === "1") {
          for (let i = 0; i < tileCountX; i++) {
            hueValues[i] = p.random(360);
            saturationValues[i] = p.random(100);
            brightnessValues[i] = p.random(100);
          }
        }

        if (p.key === "2") {
          for (let i = 0; i < tileCountX; i++) {
            hueValues[i] = p.random(360);
            saturationValues[i] = p.random(100);
            brightnessValues[i] = 100;
          }
        }

        if (p.key === "3") {
          for (let i = 0; i < tileCountX; i++) {
            hueValues[i] = p.random(360);
            saturationValues[i] = 100;
            brightnessValues[i] = p.random(100);
          }
        }

        if (p.key === "4") {
          for (let i = 0; i < tileCountX; i++) {
            hueValues[i] = 0;
            saturationValues[i] = 0;
            brightnessValues[i] = p.random(100);
          }
        }

        if (p.key === "5") {
          for (let i = 0; i < tileCountX; i++) {
            hueValues[i] = 195;
            saturationValues[i] = 100;
            brightnessValues[i] = p.random(100);
          }
        }

        if (p.key === "6") {
          for (let i = 0; i < tileCountX; i++) {
            hueValues[i] = 195;
            saturationValues[i] = p.random(100);
            brightnessValues[i] = 100;
          }
        }

        if (p.key === "7") {
          for (let i = 0; i < tileCountX; i++) {
            hueValues[i] = p.random(180);
            saturationValues[i] = p.random(80, 100);
            brightnessValues[i] = p.random(50, 90);
          }
        }

        if (p.key === "8") {
          for (let i = 0; i < tileCountX; i++) {
            hueValues[i] = p.random(180, 360);
            saturationValues[i] = p.random(80, 100);
            brightnessValues[i] = p.random(50, 90);
          }
        }

        if (p.key === "9") {
          for (let i = 0; i < tileCountX; i++) {
            if (i % 2 === 0) {
              hueValues[i] = p.random(360);
              saturationValues[i] = 100;
              brightnessValues[i] = p.random(100);
            } else {
              hueValues[i] = 195;
              saturationValues[i] = p.random(100);
              brightnessValues[i] = 100;
            }
          }
        }

        if (p.key === "0") {
          for (let i = 0; i < tileCountX; i++) {
            if (i % 2 === 0) {
              hueValues[i] = 140;
              saturationValues[i] = p.random(30, 100);
              brightnessValues[i] = p.random(40, 100);
            } else {
              hueValues[i] = 210;
              saturationValues[i] = p.random(40, 100);
              brightnessValues[i] = p.random(50, 100);
            }
          }
        }
      };
    };
    const p5Instance = new p5(sketch, sketchRef.current!);
    return () => p5Instance.remove();
  }, []);

  return <div ref={sketchRef} />;
}
