const BGCOLOR = [23, 195, 50];
const TGSTRING = "touch grass ";

const CTHRESHOLD = 750;

let allGrassProfile = [];
let gCOLOR;
let fCOLORS;
let touchMode = false;

function setup() {
  gCOLOR = color(41, 157, 0);
  fCOLORS = {
    t: color(119, 239, 255),
    o: color(255, 187, 194),
    u: color(255, 153, 0),
    c: color(242, 18, 0),
    h: color(221, 255, 123),
    g: color(255, 255, 255),
    r: color(255, 229, 0),
    a: color(138, 97, 255),
    $: color(255, 92, 0),
    s: color(227, 192, 255),
  };

  createCanvas(windowWidth, windowHeight);
  background(BGCOLOR);
  frameRate(60);

  let field = select("field");
  plantGrass();

  describe(
    'Background of pattern created by repeating the phrase "touch grass". Hovering over the letters makes them morph into flowers.',
  );
}

function draw() {
  if (!touchMode && touches.length > 0) {
    touchMode = true;
  }
  for (let grassProfile of allGrassProfile) {
    grassProfile.showGrowth();
  }
}

function plantGrass() {
  let grass;
  let cycleCount = 0;

  while (!grass || grass.elt.getBoundingClientRect().top < window.innerHeight) {
    for (let curGrassType of TGSTRING) {
      grass = createSpan(curGrassType + "&#8203");
      grass.parent(field);
      allGrassProfile.push(new GrassProfile(grass, curGrassType));
    }
  }
}

class GrassProfile {
  constructor(grass, grassType) {
    this.grass = grass;
    this.grassType = grassType;
    this.growth = 1;
    this.position = this.getPosition();
  }

  showGrowth() {
    if (this.grassType == " ") return;
    if (touchMode) this.checkGrowthTM();
    else this.checkGrowth();
    this.grass.style("font-weight", this.growth);
    this.grass.style("color", this.getColor());
  }

  checkGrowth() {
    this.growth = Math.max(this.growth * 0.9, 1);
    this.distToMouse = dist(mouseX, mouseY, this.position.x, this.position.y);
    if (this.distToMouse < 300) {
      this.growth = Math.min(this.growth + 2500 / (this.distToMouse + 2), 1000);
    }
    if (mouseIsPressed && this.distToMouse < 350) {
      this.growth = Math.min(this.growth + (350 - this.distToMouse), 1000);
    }
    this.growth = Math.round(this.growth);
  }

  checkGrowthTM() {
    this.growth = Math.max(this.growth * 0.95, 1);
    let distToTouch;
    for (let touch of touches) {
      distToTouch = dist(touch.x, touch.y, this.position.x, this.position.y);
      if (distToTouch < 175) {
        // console.log('grass touched');
        this.growth = Math.min(this.growth + (175 - distToTouch), 1000);
      }
    }
    this.growth = Math.round(this.growth);
  }

  getPosition() {
    return {
      x:
        (this.grass.elt.getBoundingClientRect().left +
          this.grass.elt.getBoundingClientRect().right) /
        2,
      y:
        (this.grass.elt.getBoundingClientRect().top +
          this.grass.elt.getBoundingClientRect().bottom) /
        2,
    };
  }

  getColor() {
    let color = gCOLOR;
    if (this.growth > CTHRESHOLD) {
      let amt = (this.growth - CTHRESHOLD) / (1000 - CTHRESHOLD);
      color = lerpColor(gCOLOR, fCOLORS[this.grassType], amt);
    }
    return color;
  }
}

function updateGrassPos() {
  for (let grassProfile of allGrassProfile) {
    grassProfile.position = grassProfile.getPosition();
  }
}

setInterval(updateGrassPos, 500);
