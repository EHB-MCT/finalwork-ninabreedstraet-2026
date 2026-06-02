import p5 from "p5";

export default class Particle {
  pos: p5.Vector;
  vel: p5.Vector;
  acc: p5.Vector;
  life: number;
  done: boolean;
  hueValue: number;
  scale: number;
  p: p5;

  constructor(p: p5, x: number, y: number) {
    this.p = p;

    this.pos = p.createVector(x, y);
    this.vel = p5.Vector.random2D();
    this.vel.mult(p.random(0.2, 0.8));

    this.acc = p5.Vector.random2D();
    this.acc.mult(p.random(0.05, 0.2));

    this.life = 255;
    this.done = false;
    this.hueValue = 0;
    this.scale = 1;
  }

  update() {
    this.finished();

    this.vel.mult(0.99);
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.life -= 1;

    if (this.hueValue > 255) {
      this.hueValue = 0;
    }
    this.hueValue += 1;
    this.scale += 0.05;
  }

  display() {
    const scale = this.p.map(this.life, 255, 0, 1, 20);
    this.p.fill(this.hueValue, 255, this.life);
    this.p.ellipse(this.pos.x, this.pos.y, scale, scale);
  }

  finished() {
    if (this.life < 0) {
      this.done = true;
    } else {
      this.done = false;
    }
  }
}
