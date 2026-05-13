//Bronnen:
// - https://www.youtube.com/watch?v=AVMSCFMCz9w&t=328s

import { useEffect, useRef, useState } from "react";
import p5 from "p5";

let threshold = 80;
let currentColumn = 0;

function sortColumn(x: number, img: p5.Image, p: p5) {
  let y = 0;
  while (y < img.height) {
    while (y < img.height) {
      let index = (x + y * img.width) * 4;
      let r = img.pixels[index + 0];
      let g = img.pixels[index + 1];
      let b = img.pixels[index + 2];
      let bn = p.brightness(p.color(r, g, b));

      if (bn > threshold) {
        break;
      }
      y++;
    }

    let startY = y;

    while (y < img.height) {
      let index = (x + y * img.width) * 4;
      let r = img.pixels[index + 0];
      let g = img.pixels[index + 1];
      let b = img.pixels[index + 2];
      let bn = p.brightness(p.color(r, g, b));

      if (bn <= threshold) {
        break;
      }
      y++;
    }

    let endY = y - 1;

    if (startY < endY) {
      let sortingArr = [];
      for (let i = startY; i <= endY; i++) {
        let index = (x + i * img.width) * 4;
        let r = img.pixels[index + 0];
        let g = img.pixels[index + 1];
        let b = img.pixels[index + 2];

        sortingArr.push(p.color(r, g, b));
      }
      sortingArr.sort((a, b) => p.brightness(a) - p.brightness(b));

      for (let i = startY; i <= endY; i++) {
        let index = (x + i * img.width) * 4;
        let c = sortingArr[i - startY];
        img.pixels[index + 0] = p.red(c);
        img.pixels[index + 1] = p.green(c);
        img.pixels[index + 2] = p.blue(c);
        img.pixels[index + 3] = 255;
      }
    }
    y++;
  }
}

function sortRow(y: number, img: p5.Image, p: p5) {
  let x = 0;
  while (x < img.width) {
    while (x < img.width) {
      let index = (x + y * img.width) * 4;
      let r = img.pixels[index + 0];
      let g = img.pixels[index + 1];
      let b = img.pixels[index + 2];
      let bn = p.brightness(p.color(r, g, b));

      if (bn < threshold) {
        break;
      }
      x++;
    }

    let startX = x;

    while (y < img.height) {
      let index = (x + y * img.width) * 4;
      let r = img.pixels[index + 0];
      let g = img.pixels[index + 1];
      let b = img.pixels[index + 2];
      let bn = p.brightness(p.color(r, g, b));

      if (bn >= threshold) {
        break;
      }
      x++;
    }

    let endX = x - 1;

    if (startX < endX) {
      let sortingArr = [];
      for (let i = startX; i <= endX; i++) {
        let index = (i + y * img.width) * 4;
        let r = img.pixels[index + 0];
        let g = img.pixels[index + 1];
        let b = img.pixels[index + 2];

        sortingArr.push(p.color(r, g, b));
      }
      sortingArr.sort((a, b) => p.brightness(a) - p.brightness(b));

      for (let i = startX; i <= endX; i++) {
        let index = (i + y * img.width) * 4;
        let c = sortingArr[i - startX];
        img.pixels[index + 0] = p.red(c);
        img.pixels[index + 1] = p.green(c);
        img.pixels[index + 2] = p.blue(c);
        img.pixels[index + 3] = 255;
      }
    }
    x++;
  }
}

export default function Sketch() {
  const sketchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let p5Instance: p5;
    let img: p5.Image;
    let sortingDone = false;

    if (!sketchRef.current) return;

    const sketch = (p: p5) => {
      p.setup = () => {
        p.pixelDensity(1);
        const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
        canvas.parent(sketchRef.current!);
        p.noLoop(); // tijdelijk pauzeren tot afbeelding geladen is

        p.loadImage("/Images/Nina.jpg", (loaded) => {
          img = loaded;
          img.resize(p.windowWidth, 0);
          img.loadPixels();
          p.loop(); // start animatie pas als afbeelding klaar is
        });
      };

      p.draw = () => {
        if (!img) return;

        if (currentColumn < img.width) {
          sortColumn(currentColumn, img, p);
          currentColumn++;
          img.updatePixels();
        }

        p.image(img, 0, 0);
      };

      // p.setup = () => {
      //   p.pixelDensity(1);
      //   const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
      //   canvas.parent(sketchRef.current!);
      //   p.loadImage("/Images/Nina.jpg", (loaded) => {
      //     img = loaded;
      //     img.resize(p.windowWidth, 0);
      //     img.loadPixels();

      //     // for (let x = 0; x < img.width; x++) {
      //     //   sortColumn(x, img, p);
      //     // }

      //     // for (let y = 0; y < img.height; y++) {
      //     //   sortRow(y, img, p);
      //     // }

      //     sortColumn(currentColumn, img, p);
      //     currentColumn++;

      //     img.updatePixels();

      //     if (currentColumn >= img.width) {
      //       sortingDone = true;
      //     }

      //     // p.noLoop();
      //   });
      // };

      // p.draw = () => {
      //   p.background(255);
      //   if (img) {
      //     p.image(img, 0, 0);
      //   }
      // };
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

// let x = 0;
// let y = 0;
// let index = (x + y * img.width) * 4;
// img.pixels[index + 0] = 0;
// img.pixels[index + 1] = 0;
// img.pixels[index + 2] = 0;
// img.pixels[index + 3] = 255;
