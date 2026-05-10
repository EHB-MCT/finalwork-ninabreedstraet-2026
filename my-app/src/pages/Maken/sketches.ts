export type ParamType = "range" | "color";

export interface SketchParam {
  name: string;
  label: string;
  type: ParamType;
  min?: number;
  max?: number;
  step?: number;
  default: number | string;
}

export interface Sketch {
  id: string;
  name: string;
  desc: string;
  params: SketchParam[];
  animate: boolean;
  code: string;
}

export type ParamValues = Record<string, number | string>;

export const sketches: Sketch[] = [
  {
    id: "aim",
    name: "Ogen",
    desc: "Drie ogen volgen je cursor. De atan2-functie berekent de hoek tussen elk oog en de muis.",
    animate: true,
    params: [
      {
        name: "eyeCount",
        label: "ogen",
        type: "range",
        min: 1,
        max: 6,
        step: 1,
        default: 3,
      },
    ],
    code: `ctx.fillStyle = '#666';
ctx.fillRect(0, 0, W, H);

const eyes = [
  { x: W*0.3, y: H*0.5, r: 80 },
  { x: W*0.7, y: H*0.5, r: 80 },
];

eyes.forEach(({ x, y, r }) => {
  const angle = Math.atan2(mouse.y - y, mouse.x - x);
  ctx.save();
  ctx.translate(x, y);
  ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI*2);
  ctx.fillStyle = '#fff'; ctx.fill();
  ctx.rotate(angle);
  ctx.beginPath(); ctx.arc(r*0.35, 0, r*0.35, 0, Math.PI*2);
  ctx.fillStyle = '#111'; ctx.fill();
  ctx.restore();
});`,
  },
  {
    id: "drawing",
    name: "Tekenen",
    desc: "Klik en sleep de muis om lijnen te tekenen. De kleur verschuift met de muissnelheid — een regenboog onder je hand.",
    animate: true,
    params: [
      {
        name: "weight",
        label: "lijndikte",
        type: "range",
        min: 1,
        max: 20,
        step: 1,
        default: 4,
      },
      {
        name: "hueShift",
        label: "kleursnelheid",
        type: "range",
        min: 1,
        max: 20,
        step: 1,
        default: 5,
      },
    ],
    code: `if(!state.hue) state.hue = 0;
if(!state.prevX) { state.prevX = mouse.x; state.prevY = mouse.y; }
const mx = mouse.x, my = mouse.y;
const dx = mx - state.prevX, dy = my - state.prevY;
const dist = Math.sqrt(dx*dx + dy*dy);
if(mouse.down && dist > 0) {
  state.hue = (state.hue + hueShift) % 360;
  const h = state.hue;
  const s = 1, l = 0.6;
  const c = (1 - Math.abs(2*l - 1)) * s;
  const x2 = c * (1 - Math.abs((h/60) % 2 - 1));
  const m = l - c/2;
  let r=0,g=0,b=0;
  if(h<60){r=c;g=x2;}else if(h<120){r=x2;g=c;}else if(h<180){g=c;b=x2;}else if(h<240){g=x2;b=c;}else if(h<300){r=x2;b=c;}else{r=c;b=x2;}
  const col = \`rgb(\${Math.round((r+m)*255)},\${Math.round((g+m)*255)},\${Math.round((b+m)*255)})\`;
  ctx.strokeStyle = col;
  ctx.lineWidth = weight;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(state.prevX, state.prevY);
  ctx.lineTo(mx, my);
  ctx.stroke();
}
state.prevX = mx;
state.prevY = my;`,
  },
  {
    id: "lissajous",
    name: "Lissajous",
    desc: "Een Lissajous-curve is het spoor van een punt dat twee harmonische trillingen volgt — een klassiek voorbeeld van wiskundige schoonheid in code.",
    animate: true,
    params: [
      {
        name: "freqA",
        label: "freq A",
        type: "range",
        min: 1,
        max: 10,
        step: 1,
        default: 3,
      },
      {
        name: "freqB",
        label: "freq B",
        type: "range",
        min: 1,
        max: 10,
        step: 1,
        default: 2,
      },
      {
        name: "delta",
        label: "fase",
        type: "range",
        min: 0,
        max: 314,
        step: 1,
        default: 90,
      },
      {
        name: "speed",
        label: "snelheid",
        type: "range",
        min: 1,
        max: 100,
        step: 1,
        default: 20,
      },
      { name: "color1", label: "kleur", type: "color", default: "#7f77dd" },
    ],
    code: `const cx = W/2, cy = H/2;
const r = Math.min(W,H)*0.4;
const points = 800;
const d = delta * Math.PI/100;
ctx.clearRect(0,0,W,H);
ctx.fillStyle='#0e0e10';
ctx.fillRect(0,0,W,H);
for(let i=0;i<points-1;i++){
  const t1=(i/points)*2*Math.PI;
  const t2=((i+1)/points)*2*Math.PI;
  const x1=cx+r*Math.sin(freqA*t1+d);
  const y1=cy+r*Math.sin(freqB*t1);
  const x2=cx+r*Math.sin(freqA*t2+d);
  const y2=cy+r*Math.sin(freqB*t2);
  const alpha=i/points;
  ctx.strokeStyle=color1+Math.floor(alpha*255).toString(16).padStart(2,'0');
  ctx.lineWidth=2;
  ctx.beginPath();
  ctx.moveTo(x1,y1);
  ctx.lineTo(x2,y2);
  ctx.stroke();
}`,
  },
  {
    id: "particles",
    name: "Deeltjes",
    desc: "Honderden deeltjes volgen de muis. Beweeg je muis over de canvas om ze aan te trekken.",
    animate: true,
    params: [
      {
        name: "count",
        label: "aantal",
        type: "range",
        min: 20,
        max: 300,
        step: 10,
        default: 120,
      },
      {
        name: "radius",
        label: "straal",
        type: "range",
        min: 50,
        max: 300,
        step: 10,
        default: 150,
      },
      {
        name: "speed",
        label: "snelheid",
        type: "range",
        min: 1,
        max: 10,
        step: 1,
        default: 3,
      },
      { name: "color1", label: "kleur", type: "color", default: "#5DCAA5" },
    ],
    code: `const mx=mouse.x||W/2, my=mouse.y||H/2;
if(!state.particles){
  state.particles=[];
  for(let i=0;i<count;i++) state.particles.push({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-0.5)*2,vy:(Math.random()-0.5)*2,size:Math.random()*3+1});
}
while(state.particles.length>count) state.particles.pop();
while(state.particles.length<count) state.particles.push({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-0.5)*2,vy:(Math.random()-0.5)*2,size:Math.random()*3+1});
ctx.fillStyle='rgba(14,14,16,0.18)';
ctx.fillRect(0,0,W,H);
state.particles.forEach(p=>{
  const dx=mx-p.x,dy=my-p.y,d=Math.sqrt(dx*dx+dy*dy)||1;
  if(d<radius){const f=(1-d/radius)*0.05*speed;p.vx+=dx/d*f;p.vy+=dy/d*f;}
  p.vx*=0.97;p.vy*=0.97;p.x+=p.vx;p.y+=p.vy;
  if(p.x<0)p.x=W;if(p.x>W)p.x=0;if(p.y<0)p.y=H;if(p.y>H)p.y=0;
  ctx.beginPath();ctx.arc(p.x,p.y,p.size,0,Math.PI*2);ctx.fillStyle=color1+'cc';ctx.fill();
});`,
  },
  {
    id: "fractal",
    name: "Fractal boom",
    desc: "Een recursieve boom groeit op basis van hoek en lengteverhouding. Kleine aanpassingen leiden tot totaal andere bomen.",
    animate: false,
    params: [
      {
        name: "angle",
        label: "hoek",
        type: "range",
        min: 5,
        max: 60,
        step: 1,
        default: 25,
      },
      {
        name: "ratio",
        label: "verhouding",
        type: "range",
        min: 50,
        max: 90,
        step: 1,
        default: 70,
      },
      {
        name: "depth",
        label: "diepte",
        type: "range",
        min: 3,
        max: 12,
        step: 1,
        default: 9,
      },
      { name: "color1", label: "bladkleur", type: "color", default: "#639922" },
      { name: "color2", label: "takkleur", type: "color", default: "#633806" },
    ],
    code: `ctx.clearRect(0,0,W,H);
ctx.fillStyle='#0e0e10';
ctx.fillRect(0,0,W,H);
function branch(x,y,len,ang,d){
  if(d===0||len<1)return;
  const x2=x+Math.cos(ang*Math.PI/180)*len;
  const y2=y-Math.sin(ang*Math.PI/180)*len;
  ctx.strokeStyle=d<=2?color1:color2;
  ctx.lineWidth=Math.max(0.5,d*0.5);
  ctx.globalAlpha=d<=2?0.8:1;
  ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x2,y2);ctx.stroke();
  branch(x2,y2,len*ratio/100,ang+angle,d-1);
  branch(x2,y2,len*ratio/100,ang-angle,d-1);
}
ctx.globalAlpha=1;
branch(W/2,H-20,H*0.25,90,depth);`,
  },
  {
    id: "waves",
    name: "Geluidsgolven",
    desc: "Interfererende sinusgolven creëren complexe patronen. Zie hoe golven elkaar versterken of opheffen.",
    animate: true,
    params: [
      {
        name: "waves",
        label: "golven",
        type: "range",
        min: 1,
        max: 8,
        step: 1,
        default: 3,
      },
      {
        name: "amp",
        label: "amplitude",
        type: "range",
        min: 10,
        max: 100,
        step: 1,
        default: 40,
      },
      {
        name: "speed",
        label: "snelheid",
        type: "range",
        min: 1,
        max: 10,
        step: 1,
        default: 3,
      },
      { name: "color1", label: "kleur", type: "color", default: "#EF9F27" },
    ],
    code: `ctx.fillStyle='rgba(14,14,16,0.3)';
ctx.fillRect(0,0,W,H);
for(let w=0;w<waves;w++){
  ctx.beginPath();
  const freq=(w+1)*0.015;
  const phase=t*(speed/30)+(w*Math.PI*2/waves);
  const yOff=H/2+(w-(waves-1)/2)*20;
  for(let x=0;x<W;x++){
    const y=yOff+amp*Math.sin(x*freq+phase)*Math.sin(x*freq*0.3+phase*0.7);
    x===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
  }
  ctx.strokeStyle=color1+Math.floor(180/waves+80).toString(16).padStart(2,'0');
  ctx.lineWidth=2;ctx.stroke();
}`,
  },
  {
    id: "spirograph",
    name: "Spirograaf",
    desc: "Het klassieke tekenspeelgoed digitaal nagebootst. Drie radiussen creëren eindeloos veel unieke patronen.",
    animate: false,
    params: [
      {
        name: "R",
        label: "groot wiel",
        type: "range",
        min: 50,
        max: 200,
        step: 5,
        default: 120,
      },
      {
        name: "r",
        label: "klein wiel",
        type: "range",
        min: 10,
        max: 100,
        step: 5,
        default: 45,
      },
      {
        name: "pen",
        label: "pen afstand",
        type: "range",
        min: 5,
        max: 100,
        step: 5,
        default: 60,
      },
      { name: "color1", label: "kleur", type: "color", default: "#D4537E" },
    ],
    code: `const cx=W/2,cy=H/2;
ctx.clearRect(0,0,W,H);
ctx.fillStyle='#0e0e10';
ctx.fillRect(0,0,W,H);
function gcd(a,b){return b?gcd(b,a%b):a;}
ctx.beginPath();
for(let i=0;i<=2000;i++){
  const tt=i/2000*Math.PI*2*(R/gcd(R,r));
  const x=cx+(R-r)*Math.cos(tt)+pen*Math.cos((R-r)/r*tt);
  const y=cy+(R-r)*Math.sin(tt)-pen*Math.sin((R-r)/r*tt);
  i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
}
ctx.strokeStyle=color1;ctx.lineWidth=1.5;ctx.stroke();`,
  },
];
