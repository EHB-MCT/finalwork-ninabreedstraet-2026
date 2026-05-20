import type { ReactNode } from "react";

export type ParamType = "range" | "color" | "image" | "text";

export interface SketchParam {
  codeSnippet: ReactNode;
  explanation: ReactNode;
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
  paramDocs: Record<string, string>;
  animate: boolean;
  code: string;
}

export type ParamValues = Record<string, number | string>;

export const SKETCHES: Sketch[] = [
  {
    id: "pixelsort",
    name: "Pixel Sorting",
    desc: "Pixels worden gesorteerd op helderheid kolom per kolom.",
    animate: true,
    params: [
      {
        name: "threshold",
        label: "drempel",
        type: "range",
        min: 0,
        max: 100,
        step: 1,
        default: 30,
        codeSnippet: ` 
const bn = (d[i]*299 + d[i+1]*587 + d[i+2]*114) / 1000 / 2.55;
if (bn > threshold) break;
y++;`,
        explanation: `
Deze code berekent eerst de helderheid van een pixel en gebruikt die helderheid daarna om te bepalen of de pixel deel uitmaakt van een licht of donker gebied in de afbeelding.
De variabele d bevat alle pixelgegevens van de afbeelding. Elke pixel bestaat uit vier waarden: rood (R), groen (G), blauw (B) en alpha/transparantie (A). In de code verwijst d[i] naar de rode waarde van de huidige pixel, d[i+1] naar groen en d[i+2] naar blauw. Deze waarden liggen allemaal tussen 0 en 255.

Met deze RGB-waarden wordt vervolgens een helderheidswaarde berekend:

const bn = (d[i]*299 + d[i+1]*587 + d[i+2]*114) / 1000 / 2.55;

Dit is een standaardformule voor luminantie, waarbij groen zwaarder meetelt dan rood en blauw omdat het menselijk oog gevoeliger is voor groen licht. De formule komt overeen met:

0.299 × rood + 0.587 × groen + 0.114 × blauw

De eerste berekening geeft een waarde tussen 0 en 255. Daarna wordt gedeeld door 2.55, zodat de uiteindelijke helderheid (bn) een schaal krijgt van 0 tot 100. Een zwarte pixel heeft dus ongeveer waarde 0, een witte pixel ongeveer 100 en grijstinten liggen daartussen.

Daarna vergelijkt de code deze helderheid met een ingestelde drempelwaarde (threshold):

if (bn > threshold) break;

Als de pixel helderder is dan de drempel, stopt de lus onmiddellijk met break. Dat betekent dat de code een lichte pixel heeft gevonden en niet verder hoeft te zoeken.

Wanneer de pixel nog niet helder genoeg is, wordt:

y++;

uitgevoerd. Hierdoor schuift de code één pixel verder naar beneden in dezelfde kolom van de afbeelding.

Samen zorgt deze code er dus voor dat de afbeelding kolom per kolom wordt gescand totdat een helder segment wordt gevonden. Die segmenten worden later gebruikt voor het pixel-sorting effect waarbij pixels binnen een bepaald gebied opnieuw worden gesorteerd op helderheid.`,
      },
      {
        name: "image",
        label: "afbeelding",
        type: "image",
        default:
          "https://m.media-amazon.com/images/I/81nFcvY8zIL._AC_UF1000,1000_QL80_.jpg",
        codeSnippet: `
const img = new Image();
img.src = image;
`,
        explanation: "De afbeelding die wordt gebruikt voor pixel sorting.",
      },
    ],
    paramDocs: {
      threshold:
        "Helderheidsdrempel (0-100). Alleen pixels boven deze waarde worden gesorteerd.",
    },
    code: `
if (!state.ready) {
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.src = image;
  img.onload = () => {
    ctx.drawImage(img, 0, 0, W, H);
    state.pixels = ctx.getImageData(0, 0, W, H);
    state.col = 0;
    state.ready = true;
  };
  return;
}

if (state.col < W) {
  const d = state.pixels.data;
  let y = 0;
  while (y < H) {
    while (y < H) {
      const i = (state.col + y * W) * 4;
      const bn = (d[i]*299 + d[i+1]*587 + d[i+2]*114) / 1000 / 2.55;
      if (bn > threshold) break;
      y++;
    }
    const startY = y;
    while (y < H) {
      const i = (state.col + y * W) * 4;
      const bn = (d[i]*299 + d[i+1]*587 + d[i+2]*114) / 1000 / 2.55;
      if (bn <= threshold) break;
      y++;
    }
    const endY = y - 1;
    if (startY < endY) {
      const seg = [];
      for (let j = startY; j <= endY; j++) {
        const i = (state.col + j * W) * 4;
        seg.push({ r: d[i], g: d[i+1], b: d[i+2], bn: (d[i]*299+d[i+1]*587+d[i+2]*114)/1000 });
      }
      seg.sort((a, b) => a.bn - b.bn);
      for (let j = startY; j <= endY; j++) {
        const i = (state.col + j * W) * 4;
        d[i] = seg[j-startY].r;
        d[i+1] = seg[j-startY].g;
        d[i+2] = seg[j-startY].b;
      }
    }
    y++;
  }
  state.col++;
  ctx.putImageData(state.pixels, 0, 0);
}
  `,
  },
  {
    id: "gradient",
    name: "Gradiënt",
    desc: "Vloeiende kleurcirkels volgen je muis en stoten elkaar af op een gradiëntachtergrond.",
    animate: true,
    params: [
      {
        name: "color1",
        label: "kleur 1",
        type: "color",
        default: "#ff6b6b",
        codeSnippet: `function hexToRgb(hex) {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return [r,g,b];

  function colorAt(x) {
  const c1 = hexToRgb(color1);
  const c2 = hexToRgb(color2);
  const c3 = hexToRgb(color3);
  const amt = Math.max(0, Math.min(1, x / W));
  if (amt < 0.5) return lerpRgb(c1, c2, amt * 2);
  return lerpRgb(c2, c3, (amt - 0.5) * 2);
}
}
`,
        explanation: `Deze code doet eigenlijk twee dingen met kleuren.

Eerst neemt hij een kleur die geschreven is als een “webkleur” (zoals #ff6b6b) en breekt die op in drie losse getallen: rood, groen en blauw. Dat is wat hexToRgb doet. Het kijkt naar stukjes van de tekst en zet die om naar cijfers die de computer begrijpt.

Daarna probeert de code een kleur te kiezen op basis van waar je bent op het scherm (x-positie). Hij zegt: “links is kleur 1, in het midden kleur 2, en rechts kleur 3.” En tussen die kleuren mengt hij langzaam zodat het niet plots verandert maar mooi vloeiend overgaat.

Alleen: in deze code zit eigenlijk een foutje, want die tweede functie (colorAt) staat per ongeluk binnen de eerste functie. Normaal zouden dit twee aparte functies moeten zijn.`,
      },
      {
        name: "color2",
        label: "kleur 2",
        type: "color",
        default: "#6b6bff",
        codeSnippet: `function hexToRgb(hex) {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return [r,g,b];

  function colorAt(x) {
  const c1 = hexToRgb(color1);
  const c2 = hexToRgb(color2);
  const c3 = hexToRgb(color3);
  const amt = Math.max(0, Math.min(1, x / W));
  if (amt < 0.5) return lerpRgb(c1, c2, amt * 2);
  return lerpRgb(c2, c3, (amt - 0.5) * 2);
}
}
`,
        explanation: `Deze code doet eigenlijk twee dingen met kleuren.

Eerst neemt hij een kleur die geschreven is als een “webkleur” (zoals #ff6b6b) en breekt die op in drie losse getallen: rood, groen en blauw. Dat is wat hexToRgb doet. Het kijkt naar stukjes van de tekst en zet die om naar cijfers die de computer begrijpt.

Daarna probeert de code een kleur te kiezen op basis van waar je bent op het scherm (x-positie). Hij zegt: “links is kleur 1, in het midden kleur 2, en rechts kleur 3.” En tussen die kleuren mengt hij langzaam zodat het niet plots verandert maar mooi vloeiend overgaat.

Alleen: in deze code zit eigenlijk een foutje, want die tweede functie (colorAt) staat per ongeluk binnen de eerste functie. Normaal zouden dit twee aparte functies moeten zijn.`,
      },
      {
        name: "color3",
        label: "kleur 3",
        type: "color",
        default: "#6bffb8",
        codeSnippet: `function hexToRgb(hex) {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return [r,g,b];

  function colorAt(x) {
  const c1 = hexToRgb(color1);
  const c2 = hexToRgb(color2);
  const c3 = hexToRgb(color3);
  const amt = Math.max(0, Math.min(1, x / W));
  if (amt < 0.5) return lerpRgb(c1, c2, amt * 2);
  return lerpRgb(c2, c3, (amt - 0.5) * 2);
}
}
`,
        explanation: `Deze code doet eigenlijk twee dingen met kleuren.

Eerst neemt hij een kleur die geschreven is als een “webkleur” (zoals #ff6b6b) en breekt die op in drie losse getallen: rood, groen en blauw. Dat is wat hexToRgb doet. Het kijkt naar stukjes van de tekst en zet die om naar cijfers die de computer begrijpt.

Daarna probeert de code een kleur te kiezen op basis van waar je bent op het scherm (x-positie). Hij zegt: “links is kleur 1, in het midden kleur 2, en rechts kleur 3.” En tussen die kleuren mengt hij langzaam zodat het niet plots verandert maar mooi vloeiend overgaat.

Alleen: in deze code zit eigenlijk een foutje, want die tweede functie (colorAt) staat per ongeluk binnen de eerste functie. Normaal zouden dit twee aparte functies moeten zijn.`,
      },
      {
        name: "circleCount",
        label: "aantal cirkels",
        type: "range",
        min: 1,
        max: 20,
        step: 1,
        default: 7,
        codeSnippet: `if (!state.circles || state.circleCount !== circleCount) {
  state.circleCount = circleCount;

  state.circles = Array.from({ length: circleCount }, (_, i) => {
    const angle = (i / circleCount) * Math.PI * 2;

    return {
      x: W * (0.5 + Math.cos(angle) * 0.25),
      y: H * (0.5 + Math.sin(angle) * 0.25),
      r: 80 + Math.random() * 60,
      ox: 0,
      oy: 0,
    };
  });
}`,
        explanation: `Deze code kijkt eerst of er al cirkels bestaan, of dat het aantal cirkels veranderd is. Als dat zo is, maakt hij alles opnieuw aan.

        Daarna zegt hij eigenlijk: “ik ga een rondje maken en daar allemaal cirkels op zetten.” Hij verdeelt ze netjes in een cirkelvorm door elke cirkel een hoek te geven (alsof je ze op een klok zet). Met die hoek berekent hij waar elke cirkel moet staan op het canvas.

Elke cirkel krijgt ook een grootte (soms groot, soms wat kleiner) en een beetje extra ruimte om later te kunnen bewegen. De ox en oy zijn als “verborgen duwtjes” die later gebruikt worden om de cirkels te laten verschuiven.

Kort gezegd: de code maakt een groep cirkels die netjes in een ronde vorm staan, en klaar zijn om daarna te bewegen.`,
      },
      {
        name: "blurAmount",
        label: "blurriness",
        type: "range",
        min: 1,
        max: 30,
        step: 1,
        default: 10,
        codeSnippet: `ctx.filter = \`blur(\${blurAmount}px)\`;
`,
        explanation: `Het blur-effect pas je normaal toe in de styling, in deze programmeertaal wordt het toegepast op de context van het canvas. Dat is wat er wordt bedoeld met ctx. 
        
Door er een punt achter te zetten en te verwijzen naar de filter, verwijs je naar welke filter er op de context/canvas moet worden toegepast. Door 'blur(10px)' te doen wordt er een blur-effect toegepast op de 10 pixels van de randen van elke cirkel.`,
      },
    ],
    paramDocs: {
      color1: "Eerste kleur van de gradiëntachtergrond en de cirkels.",
      color2: "Middelste kleur van de gradiënt.",
      color3: "Derde kleur van de gradiënt.",
      circleCount: "Aantal cirkels",
    },
    code: `
    console.log(mouse)
// Initialiseer cirkels eenmalig
if (!state.circles || state.circleCount !== circleCount) {
  state.circleCount = circleCount;

  state.circles = Array.from({ length: circleCount }, (_, i) => {
    const angle = (i / circleCount) * Math.PI * 2;

    return {
      x: W * (0.5 + Math.cos(angle) * 0.25),
      y: H * (0.5 + Math.sin(angle) * 0.25),
      r: 80 + Math.random() * 60,
      ox: 0,
      oy: 0,
    };
  });
}

// Helper: hex naar rgb
function hexToRgb(hex) {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return [r,g,b];
}

// Helper: lerp tussen twee rgb-kleuren
function lerpRgb(a, b, t) {
  return [
    Math.round(a[0] + (b[0]-a[0])*t),
    Math.round(a[1] + (b[1]-a[1])*t),
    Math.round(a[2] + (b[2]-a[2])*t),
  ];
}

// Kleur op basis van x-positie (3-stop gradiënt)
function colorAt(x) {
  const c1 = hexToRgb(color1);
  const c2 = hexToRgb(color2);
  const c3 = hexToRgb(color3);
  const amt = Math.max(0, Math.min(1, x / W));
  if (amt < 0.5) return lerpRgb(c1, c2, amt * 2);
  return lerpRgb(c2, c3, (amt - 0.5) * 2);
}

// Teken gradiëntachtergrond kolom per kolom
for (let i = 0; i < W; i++) {
  const [r,g,b] = colorAt(i);
  ctx.fillStyle = \`rgb(\${r},\${g},\${b})\`;
  ctx.fillRect(i, 0, 1, H);
}

const mx = mouse.x || W/2;
const my = mouse.y || H/2;

// Muis aantrekking
for (const c of state.circles) {
  c.ox += ((mx - c.x) * 0.25 - c.ox) * 0.038;
  c.oy += ((my - c.y) * 0.25 - c.oy) * 0.038;
}

// Cirkels uit elkaar duwen
for (let i = 0; i < state.circles.length; i++) {
  for (let j = i+1; j < state.circles.length; j++) {
    const a = state.circles[i], b = state.circles[j];
    const dx = (b.x+b.ox) - (a.x+a.ox);
    const dy = (b.y+b.oy) - (a.y+a.oy);
    const dist = Math.sqrt(dx*dx+dy*dy) || 1;
    const minD = a.r + b.r;
    if (dist < minD) {
      const overlap = (minD - dist) / 2;
      a.ox -= dx/dist * overlap;
      a.oy -= dy/dist * overlap;
      b.ox += dx/dist * overlap;
      b.oy += dy/dist * overlap;
    }
  }
}

// Cirkels tekenen met blur
for (const c of state.circles) {
  const cx = c.x + c.ox;
  const cy = c.y + c.oy;
  const [r,g,b] = colorAt(cx);
  ctx.save();
  ctx.filter = \`blur(\${blurAmount}px)\`;
  ctx.beginPath();
  ctx.arc(cx, cy, c.r, 0, Math.PI*2);
  ctx.fillStyle = \`rgba(\${r},\${g},\${b},0.78)\`;
  ctx.fill();
  ctx.restore();
}
  `,
  },
  {
    id: "grid",
    name: "Grid",
    desc: "Een raster van afgeronde rechthoeken die krimpen naarmate de muis dichterbij komt.",
    animate: true,
    params: [
      {
        name: "spacing",
        label: "rastergrootte",
        type: "range",
        min: 20,
        max: 120,
        step: 5,
        default: 60,
        codeSnippet: undefined,
        explanation: undefined,
      },
      {
        name: "scale",
        label: "gevoeligheid",
        type: "range",
        min: 10,
        max: 200,
        step: 5,
        default: 80,
        codeSnippet: undefined,
        explanation: undefined,
      },
    ],
    paramDocs: {
      spacing:
        "De afstand tussen de vakjes in pixels. Kleinere waarden geven een dichter raster.",
      scale:
        "Hoe snel vakjes krimpen bij muisnäheid. Hogere waarden = sterker effect.",
    },
    code: `ctx.fillStyle = '#000000';
ctx.fillRect(0, 0, W, H);

const cols = Math.floor(W / spacing);
const rows = Math.floor(H / spacing);
const mx = mouse.x ?? W / 2;
const my = mouse.y ?? H / 2;
const scaleFactor = scale / 100;

for (let i = 0; i < cols; i++) {
  for (let j = 0; j < rows; j++) {
    const cx = spacing / 2 + i * spacing;
    const cy = spacing / 2 + j * spacing;
    const dx = mx - cx;
    const dy = my - cy;
    const dist = Math.sqrt(dx*dx + dy*dy);
    const maxSize = spacing * 0.9;
    const size = Math.max(4, maxSize * Math.min(1, dist / (scale * 2)));
    const r = Math.min(12, size * 0.25);
    const x = cx - size / 2;
    const y = cy - size / 2;

    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + size - r, y);
    ctx.quadraticCurveTo(x + size, y, x + size, y + r);
    ctx.lineTo(x + size, y + size - r);
    ctx.quadraticCurveTo(x + size, y + size, x + size - r, y + size);
    ctx.lineTo(x + r, y + size);
    ctx.quadraticCurveTo(x, y + size, x, y + size - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();

    ctx.strokeStyle = '#141414';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = '#ffffff';
    ctx.fill();
  }
}
 `,
  },
  {
    id: "ascii",
    name: "ASCII",
    desc: "Een afbeelding omgezet naar ASCII-tekens op basis van helderheid.",
    animate: true,
    params: [
      {
        name: "size",
        label: "tekengrootte",
        type: "range",
        min: 4,
        max: 20,
        step: 1,
        default: 8,
        codeSnippet: undefined,
        explanation: undefined,
      },
      {
        name: "charset",
        label: "tekenstijl",
        type: "range",
        min: 0,
        max: 2,
        step: 1,
        default: 0,
        codeSnippet: undefined,
        explanation: undefined,
      },
      {
        name: "color1",
        label: "tekstkleur",
        type: "color",
        default: "#ffffff",
        codeSnippet: undefined,
        explanation: undefined,
      },
      {
        name: "image",
        label: "afbeelding",
        type: "image",
        default:
          "https://m.media-amazon.com/images/I/81nFcvY8zIL._AC_UF1000,1000_QL80_.jpg",
        codeSnippet: `
const img = new Image();
img.src = image;
`,
        explanation: "De afbeelding die wordt gebruikt voor pixel sorting.",
      },
    ],
    paramDocs: {
      size: "De grootte van elk ASCII-teken in pixels. Kleinere waarden geven meer detail.",
      charset:
        "0 = blokken (█▓▒░), 1 = symbolen (#$%&*), 2 = gedetailleerd ($@B%8&...)",
      color1: "De kleur van de ASCII-tekens.",
    },
    code: `
const charsets = [
  '█▓▒░ ',
  '#$%&*+=−:;,. ',
  '$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/|()1{}[]?-_+~<>i!lI;:,^. ',
];
const asciiChar = charsets[Math.min(Math.floor(charset), 2)];

if (!state.ready) {
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.src = image;
  img.onload = () => {
   console.log('image loaded!');
    const offscreen = document.createElement('canvas');
    offscreen.width = 80;
    offscreen.height = 80;
    const octx = offscreen.getContext('2d');
    octx.drawImage(img, 0, 0, 80, 80);
    state.imageData = octx.getImageData(0, 0, 80, 80);
    state.ready = true;
  };
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, W, H);
  return;
}

ctx.fillStyle = '#000';
ctx.fillRect(0, 0, W, H);

const d = state.imageData.data;
const imgW = state.imageData.width;
const imgH = state.imageData.height;

ctx.fillStyle = color1;
ctx.font = \`\${size}px monospace\`;
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';

for (let i = 0; i < imgW; i++) {
  for (let j = 0; j < imgH; j++) {
    const idx = (i + j * imgW) * 4;
    const bright = (d[idx] + d[idx+1] + d[idx+2]) / 3;
    const tIndex = Math.floor((bright / 255) * (asciiChar.length - 1));
    const ch = asciiChar.charAt(tIndex);
    const x = i * size + size / 2;
    const y = j * size + size / 2;
    ctx.fillText(ch, x, y);
  }
}
  `,
  },
  {
    id: "dottext",
    name: "Stippeltekst",
    desc: "Typ een woord en zie het verschijnen als stippen die reageren op je muis.",
    animate: true,
    params: [
      {
        name: "spacing",
        label: "stippelgrootte",
        type: "range",
        min: 2,
        max: 8,
        step: 1,
        default: 3,
        codeSnippet: undefined,
        explanation: undefined,
      },
      {
        name: "mouseRadius",
        label: "muisstraal",
        type: "range",
        min: 20,
        max: 200,
        step: 10,
        default: 80,
        codeSnippet: undefined,
        explanation: undefined,
      },
      {
        name: "maxGrow",
        label: "max groei",
        type: "range",
        min: 5,
        max: 50,
        step: 1,
        default: 26,
        codeSnippet: undefined,
        explanation: undefined,
      },
      {
        name: "color1",
        label: "kleur",
        type: "color",
        default: "#4db43c",
        codeSnippet: undefined,
        explanation: undefined,
      },
      {
        name: "text",
        label: "Tekst",
        type: "text",
        default: "Hello",
        codeSnippet: undefined,
        explanation: undefined,
      },
    ],
    paramDocs: {
      spacing:
        "Afstand tussen de stippen. Kleinere waarden = meer detail maar zwaarder.",
      mouseRadius: "Straal waarbinnen de muis de stippen beïnvloedt.",
      maxGrow: "Hoe groot een stip maximaal kan worden bij muisnäheid.",
      color1: "Basiskleur van de stippen.",
    },
    code: `
// Bouw stippen op uit tekst via een offscreen canvas
function buildDots(word, sp) {
  const offscreen = document.createElement('canvas');
  offscreen.width = W;
  offscreen.height = H;
  const octx = offscreen.getContext('2d');
  octx.clearRect(0, 0, W, H);

  // Pas de fontgrootte aan zodat het woord past
  const fontSize = Math.min(H * 0.7, W / (word.length * 0.65));
  octx.font = \`bold \${fontSize}px monospace\`;
  octx.fillStyle = '#fff';
  octx.textAlign = 'center';
  octx.textBaseline = 'middle';
  octx.fillText(word.toUpperCase(), W / 2, H / 2);

  const imgData = octx.getImageData(0, 0, W, H).data;
  const newDots = [];
  for (let y = sp / 2; y < H; y += sp) {
    for (let x = sp / 2; x < W; x += sp) {
      const idx = (Math.round(y) * W + Math.round(x)) * 4;
      if (imgData[idx + 3] > 128) {
        newDots.push({ x, y, baseR: sp * 0.8, r: sp * 0.8 });
      }
    }
  }
  return newDots;
}

// Initialiseer state
if (!state.dots) {
  state.dots = [];
  state.word = text;
  state.lastSpacing = spacing;
  state.dots = buildDots(state.word, spacing);
}

// Herbouw als spacing verandert
if (state.lastSpacing !== spacing) {
  state.lastSpacing = spacing;
  state.dots = buildDots(state.word, spacing);
}

// Input afhandelen: teken een tekstveldje bovenop het canvas
if (!state.inputMounted) {
  state.inputMounted = true;
  state.word = text;

  const input = document.createElement('input');
  input.type = 'text';
  input.value = state.word;
  input.maxLength = 12;
  input.placeholder = 'Typ een woord...';
  Object.assign(input.style, {
    position: 'absolute',
    bottom: '16px',
    left: '50%',
    transform: 'translateX(-50%)',
    fontSize: '16px',
    padding: '6px 14px',
    borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.2)',
    background: 'rgba(255,255,255,0.08)',
    color: '#fff',
    textAlign: 'center',
    width: '220px',
    outline: 'none',
    backdropFilter: 'blur(6px)',
    zIndex: '10',
  });
}

ctx.fillStyle = '#111';
ctx.fillRect(0, 0, W, H);

// Kleur parsen
const r0 = parseInt(color1.slice(1,3),16);
const g0 = parseInt(color1.slice(3,5),16);
const b0 = parseInt(color1.slice(5,7),16);

for (const d of state.dots) {
  const dx = d.x - mouse.x;
  const dy = d.y - mouse.y;
  const dist = Math.sqrt(dx*dx + dy*dy);
  const influence = Math.max(0, 1 - dist / mouseRadius);
  const targetR = d.baseR + influence * maxGrow;
  d.r += (targetR - d.r) * 0.15;

  const glow = d.r / (d.baseR + maxGrow);
  const rc = Math.round(r0 + glow * (255 - r0) * 0.7);
  const gc = Math.round(g0 + glow * (255 - g0) * 0.3);
  const bc = Math.round(b0 + glow * (255 - b0) * 0.2);

  ctx.beginPath();
  ctx.arc(d.x, d.y, Math.max(0.5, d.r), 0, Math.PI * 2);
  ctx.fillStyle = \`rgb(\${rc},\${gc},\${bc})\`;
  ctx.fill();
}
  `,
  },
];
