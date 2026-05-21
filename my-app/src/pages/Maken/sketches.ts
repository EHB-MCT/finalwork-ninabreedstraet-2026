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
        explanation: `const bn = (d[i]*299 + d[i+1]*587 + d[i+2]*114) / 1000 / 2.55: Dit berekent hoe helder een pixel is, een getal tussen 0 (zwart) en 100 (wit).

        'd' is de lijst van alle pixelwaarden van de afbeelding, eerder opgeslagen als state.d is de lijst van alle pixelwaarden van de afbeelding die eerder opgeslagen is. Het is gewoon een lange rij getallen waarbij elke 4 getallen samen één pixel voorstellen.

        d[i] is de rode waarde van de pixel, d[i+1] de groene en d[i+2] de blauwe. Elke pixel in de array heeft dus 4 plekjes naast elkaar: rood, groen, blauw en transparantie. De getallen 299, 587 en 114 zijn gewichten die bepalen hoe zwaar elke kleur meetelt voor de helderheid. Groen telt het zwaarst mee omdat ons oog daar het gevoeligst voor is.

        if (bn > threshold) break: Dit is een if-statement, je zegt hier: als hetgeen tussen de haakjes klopt, voer dan deze opdracht uit. De opdracht staat dan meestal tussen collades eronder, hier staat de opdracht ernaast. Als de pixel te licht is, stop dan met verder gaan.

        y++: Ga één pixel naar beneden.
`,
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
        explanation: `new Image() maakt een leeg afbeelding-object aan in de browser, en img.src = image vertelt hem welke afbeelding hij moet laden door de URL in te stellen.
        
        Een object is een container voor meerdere waarden die bij elkaar horen, je groepeert ze onder één naam.`,
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
}

  function colorAt(x) {
  const c1 = hexToRgb(color1);
  const c2 = hexToRgb(color2);
  const c3 = hexToRgb(color3);
  const amt = Math.max(0, Math.min(1, x / W));
  if (amt < 0.5) return lerpRgb(c1, c2, amt * 2);
  return lerpRgb(c2, c3, (amt - 0.5) * 2);
}
`,
        explanation: `hexToRgb: Dit is een functie die een hexkleur zoals #FF8A00 opsplitst in drie losse getallen: rood, groen en blauw. Die drie getallen worden teruggegeven als een lijstje [r, g, b].

        colorAt(x): Dit geeft de kleur terug op een bepaalde x-positie op het scherm. Het scherm heeft drie kleuren (color1, color2, color3) die vloeiend in elkaar overlopen van links naar rechts.

        const amt = Math.max(0, Math.min(1, x / W)): Dit berekent hoe ver je bent op het scherm als een getal tussen 0 en 1. Helemaal links is 0, helemaal rechts is 1.

        if (amt < 0.5) return lerpRgb(c1, c2, amt * 2): Dit is een if-statement, je zegt hier: als hetgeen tussen de haakjes klopt, voer dan deze opdracht uit. De opdracht staat dan meestal tussen collades eronder. Als je in de linkerhelft van het scherm zit, mix je tussen kleur 1 en kleur 2.

        return lerpRgb(c2, c3, (amt - 0.5) * 2): In de rechterhelft mix je tussen kleur 2 en kleur 3.
        
        `,
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
}

  function colorAt(x) {
  const c1 = hexToRgb(color1);
  const c2 = hexToRgb(color2);
  const c3 = hexToRgb(color3);
  const amt = Math.max(0, Math.min(1, x / W));
  if (amt < 0.5) return lerpRgb(c1, c2, amt * 2);
  return lerpRgb(c2, c3, (amt - 0.5) * 2);
}
`,
        explanation: `hexToRgb: Dit is een functie die een hexkleur zoals #FF8A00 opsplitst in drie losse getallen: rood, groen en blauw. Die drie getallen worden teruggegeven als een lijstje [r, g, b].

        colorAt(x): Dit geeft de kleur terug op een bepaalde x-positie op het scherm. Het scherm heeft drie kleuren (color1, color2, color3) die vloeiend in elkaar overlopen van links naar rechts.

        const amt = Math.max(0, Math.min(1, x / W)): Dit berekent hoe ver je bent op het scherm als een getal tussen 0 en 1. Helemaal links is 0, helemaal rechts is 1.

        if (amt < 0.5) return lerpRgb(c1, c2, amt * 2): Dit is een if-statement, je zegt hier: als hetgeen tussen de haakjes klopt, voer dan deze opdracht uit. De opdracht staat dan meestal tussen collades eronder. Als je in de linkerhelft van het scherm zit, mix je tussen kleur 1 en kleur 2.

        return lerpRgb(c2, c3, (amt - 0.5) * 2): In de rechterhelft mix je tussen kleur 2 en kleur 3.
        
        `,
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
}

  function colorAt(x) {
  const c1 = hexToRgb(color1);
  const c2 = hexToRgb(color2);
  const c3 = hexToRgb(color3);
  const amt = Math.max(0, Math.min(1, x / W));
  if (amt < 0.5) return lerpRgb(c1, c2, amt * 2);
  return lerpRgb(c2, c3, (amt - 0.5) * 2);
}

`,
        explanation: `hexToRgb: Dit is een functie die een hexkleur zoals #FF8A00 opsplitst in drie losse getallen: rood, groen en blauw. Die drie getallen worden teruggegeven als een lijstje [r, g, b].

        colorAt(x): Dit geeft de kleur terug op een bepaalde x-positie op het scherm. Het scherm heeft drie kleuren (color1, color2, color3) die vloeiend in elkaar overlopen van links naar rechts.

        const amt = Math.max(0, Math.min(1, x / W)): Dit berekent hoe ver je bent op het scherm als een getal tussen 0 en 1. Helemaal links is 0, helemaal rechts is 1.

        if (amt < 0.5) return lerpRgb(c1, c2, amt * 2): Dit is een if-statement, je zegt hier: als hetgeen tussen de haakjes klopt, voer dan deze opdracht uit. De opdracht staat dan meestal tussen collades eronder. Als je in de linkerhelft van het scherm zit, mix je tussen kleur 1 en kleur 2.

        return lerpRgb(c2, c3, (amt - 0.5) * 2): In de rechterhelft mix je tussen kleur 2 en kleur 3.
        
        `,
      },
      {
        name: "circleCount",
        label: "aantal cirkels",
        type: "range",
        min: 1,
        max: 20,
        step: 1,
        default: 7,
        codeSnippet: `state.circleCount = circleCount;

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
`,
        explanation: `state.state.circleCount = circleCount: Dit slaat het huidige aantal cirkels op in het project, zodat de code later kan controleren of het aantal veranderd is.
        Array.from({ length: circleCount }, (_, i) => ...): Dit maakt een lijst aan van de aantal cirkels die de gebruiker heeft aangeduid. Voor elk item wordt de opdracht uitgevoerd, waarbij i het volgnummer is (0, 1, 2...). De _ is gewoon een leeg argument dat we niet gebruiken.

        const angle = (i / circleCount) * Math.PI * 2: Dit verdeelt een volledige cirkel eerlijk over alle cirkels. Als er 4 cirkels zijn krijgen ze hoeken 0°, 90°, 180° en 270°.

        return { x, y, r, ox, oy }: Dit maakt een object aan voor elke cirkel met 5 eigenschappen: x en y is de startpositie, r is de straal (grootte), ox en oy is de verschuiving door muis of botsingen, begint op 0.

        Een object is een container voor meerdere waarden die bij elkaar horen, je groepeert ze onder één naam.
        `,
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
        
        Door er een punt achter te zetten en te verwijzen naar de filter, verwijs je naar welke filter er op de context/canvas moet worden toegepast. Door 'blur(10px)' te doen wordt er een blur-effect toegepast op de 10 pixels van de randen van elke cirkel.

        Het dollarteken en de accolade's worden gebruikt om en waarde in een tekst te plakken. Als we zonder die opstelling het woord 'size' in de code zouden plakken, zou dit niet herkend worden.

        De slashes worden nu gebruikt zodat ik deze tekens aan jullie kan tonene, zondat dat het foutmeldingen geeft in mijn code. Als ik dit niet zou doen, zou mijn code verwachten dat hier nog een waarde in komt. Terwijl deze code enkel ter demonstratie is. 
        
`,
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
        codeSnippet: `const cols = Math.floor(W / spacing);
const rows = Math.floor(H / spacing);`,
        explanation: `Met const duid je aan dat je een waarde, zoals een cijfer of een kleur, wilt koppelen aan een specifiek woord, waardoor het makkelijker opgeroepen kan worden in later code.
        
        W / spacing berekent hoeveel vakjes er horizontaal passen, als het scherm 800px breed is en spacing 20, dan is dat 40. Math.floor rond dat naar beneden af want je kan geen half vakje hebben.

        Hetzelfde geldt voor rows maar dan verticaal met de hoogte H.

        De spacing is hetgeen de gebruiker met de slider zelf aanpast.
        `,
      },
      {
        name: "scale",
        label: "gevoeligheid",
        type: "range",
        min: 10,
        max: 200,
        step: 5,
        default: 80,
        codeSnippet: `const size = Math.max(4, maxSize * Math.min(1, dist / (scale * 2)));
`,
        explanation: `Met const duid je aan dat je een waarde, zoals een cijfer of een kleur, wilt koppelen aan een specifiek woord, waardoor het makkelijker opgeroepen kan worden in later code.
        
        Je gaat het woord 'size' koppelen aan de effectieve grootte van de vakjes. Dit bereken je op deze manier: Math.max(4, maxSize * Math.min(1, dist / (scale * 2)))

        Laten we dit ontleden: 

      dist / (scale * 2): dit berekent hoe ver de muis is als een verhouding. Als de muis heel dichtbij is, is dit een klein getal. Ver weg geeft een groot getal. Scale is dus hetgeen de gebruiker met de slider aanduidt.

      Math.min(1, ...): die verhouding mag nooit groter zijn dan 1, want anders zou het vierkantje groter worden dan het vakje zelf.

      vakje = de ruimte die gereserveerd is in het raster voor één element, bepaald door spacing.
      
      vierkantje = het witte afgeronde vierkant dat binnen dat vakje getekend wordt, bepaald door size.

      maxSize * ...: die verhouding wordt vermenigvuldigd met de maximale grootte van het vakje, zodat je de echte grootte in pixels krijgt.

      Math.max(4, ...): het resultaat mag nooit kleiner zijn dan 4 pixels, want anders zou het vierkantje bijna onzichtbaar worden.

        `,
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
        codeSnippet: `ctx.font = \`\${size}px monospace\`;
`,
        explanation: `Aangezien de afbeelding gewoon uit tekens, zoals we op ons toetsenbord kunnen zien, is opgebouwd, kunnen we de grootte vanb de tekens instellen door gewoon de grootte van het lettertype in te stellen.
        Dat is wat je hier ziet. Daarnaast zie je ook veel '\' en een dollarteken en accolade's. 

        Het dollarteken en de accolade's worden gebruikt om en waarde in een tekst te plakken. Als we zonder die opstelling het woord 'size' in de code zouden plakken, zou dit niet herkend worden.

        De slashes worden nu gebruikt zodat ik deze tekens aan jullie kan tonene, zondat dat het foutmeldingen geeft in mijn code. Als ik dit niet zou doen, zou mijn code verwachten dat hier nog een waarde in komt. Terwijl deze code enkel ter demonstratie is. 
        `,
      },
      {
        name: "charset",
        label: "tekenstijl",
        type: "range",
        min: 0,
        max: 2,
        step: 1,
        default: 0,
        codeSnippet: `const charsets = [
  '█▓▒░ ',
  '#$%&*+=−:;,. ',
  '$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/|()1{}[]?-_+~<>i!lI;:,^. ',
];

const asciiChar = charsets[Math.min(Math.floor(charset), 2)];

`,
        explanation: `charsets is een lijst van 3 verschillende sets van tekens, van donker naar licht gerangschikt. 
        
        Die tekens worden later gebruikt om pixels voor te stellen als ASCII-kunst.
        
        charsets[Math.min(Math.floor(charset), 2)] kiest één van die drie sets op basis van 'charset'. 

        Charset is hetgeen de gebruiker aangeeft, dit is ofwel: 0, 1 of 2. Waarin 0 de eerste optie voorstelt. 
        
        charsets[...] gebruikt dat getal om de juiste set uit de lijst te halen, zoals charsets[0] de eerste set geeft.
        
        Math.floor rond het getal af naar beneden en Math.min(..., 2) zorgt dat je nooit boven index 2 gaat (want de lijst heeft maar 3 items: 0, 1 en 2).`,
      },
      {
        name: "color1",
        label: "tekstkleur",
        type: "color",
        default: "#ffffff",
        codeSnippet: `ctx.fillStyle = color1;
`,
        explanation: `ctx staat voor 'context' Je zegt hier dus dat de fillStyle van de context, color1 moet zijn. Color1 staat voor de kleur die de gebruiker aangeeft door de slider.`,
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
        explanation: `new Image() maakt een leeg afbeelding-object aan in de browser, en img.src = image vertelt hem welke afbeelding hij moet laden door de URL in te stellen.
        
        Een object is een container voor meerdere waarden die bij elkaar horen, je groepeert ze onder één naam.
        `,
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
        codeSnippet: `state.dots = buildDots(state.word, spacing);

        for (let y = sp / 2; y < H; y += sp) {
          for (let x = sp / 2; x < W; x += sp) {
            const idx = (Math.round(y) * W + Math.round(x)) * 4;
            if (imgData[idx + 3] > 128) {
              newDots.push({ x, y, baseR: sp * 0.8, r: sp * 0.8 });
            }
          }
        }    
`,
        explanation: `Hier stel je het woord dots gelijk aan de effectieve bolletjes die je zal zien verschijnen op het scherm. Door het woord hieraan te verbinden, wordt het makkelijker om deze later in de code te gebruiken.
        
        buildDots is hetgeen dat de bolletjes aanmaakt, dit noemen ze een functie. Deze functie heeft twee elementen nodig, het woord dat de bolletjes moeten vormen en de grootte van de bolletjes. 

        Verder zie je twee for-loops staan. for-loops ga je gebruiken als je wilt dat er bepaalde elementen zich moeten herhalen. Als je een rij van vakjes wilt, gebruik je een for-loop. Als je een raster/grid wilt, gebruik je twee for-loops in elkaar, zodat de verticale rijen zich ook horizontaal herhalen, of omgekeerd. 

        Je ziet in de eerste for-loop dus duidelijk de 'y' en in de tweede functie duidelijk de 'x'. De 'W' en 'H' staan dan voor width en height. 

        Als je meer wilt leren over hoe for-loops in elkaar steken, kijk dan zeker naar de oefeningen!
        `,
      },
      {
        name: "mouseRadius",
        label: "muisstraal",
        type: "range",
        min: 20,
        max: 200,
        step: 10,
        default: 80,
        codeSnippet: `const influence = Math.max(0, 1 - dist / mouseRadius);
`,
        explanation: `Hier berekenen we de invloed die de muis heeft op de bolletjes. Met 'invloed' wordt er verwezen naar hoe groot de straal is van het oppervlak onder de muis, waar de bolletjes groter worden.
        
        Dist is de afstand tussenhet bolletje en de muis. mouseRadius wordt ingesteld door de gebruiker met de slider en bepaalt dus hoe groot die straal is. 

        dist / mouseRadius berekent hoe ver de muis is als een verhouding: als de muis op de rand van de cirkel zit is dat 1, als hij er middenin zit is dat 0.

        Door 1 - ervoor te zetten draai je dat om: dicht bij de muis = hoge influence, ver weg = lage influence. 
        
        De Math.max(0, ...) zorgt ervoor dat de influence nooit negatief wordt als de muis buiten de cirkel is.
        `,
      },
      {
        name: "maxGrow",
        label: "max groei",
        type: "range",
        min: 5,
        max: 50,
        step: 1,
        default: 26,
        codeSnippet: `const targetR = d.baseR + influence * maxGrow`,
        explanation: `Met const duid je aan dat je een waarde, zoals een cijfer of een kleur, wilt koppelen aan een specifiek woord, waardoor het makkelijker opgeroepen kan worden in later code.
        
        Hier gaan we de target-radius berekenen, met target wordt de muis bedoeld. Met de radius wordt er verwezen naar straal van de oppervlakte waar de muis invloed op heeft.
        
        Nu gaan we over naar de berekening. d.baseR staat voor de normale straal van de bolletjes die letters opmaken, de influence staat voor de invloed die de muis heeft en de maxGrow is hetgeen de gebruiker instelt aan de hand van de sliders en verwijst dus naar de maximale grootte van de bolletjes.
        
        Je doet influence maal de maxGrow om te berekenen hoeveel het bolletje extra groeit op basis van hoe dicht de muis is, daar tel je dan de basis groote van het bolletje bij op.
        `,
      },
      {
        name: "color1",
        label: "kleur",
        type: "color",
        default: "#4db43c",
        codeSnippet: `const r0 = parseInt(color1.slice(1,3),16);
const g0 = parseInt(color1.slice(3,5),16);
const b0 = parseInt(color1.slice(5,7),16);`,
        explanation: `Met const duid je aan dat je een waarde, zoals een cijfer of een kleur, wilt koppelen aan een specifiek woord, waardoor het makkelijker opgeroepen kan worden in later code. 
          
          Hier zie je dus een 'const' met r, g en b. Dit staat voor: rood, groen en blauw. 

          Color1 stelt de waarde voor die de gebruiker aanduidt met de slider. Een kleurwaarde kan je op verschillende manier voorstellen, hier geeft de slider dit soort kleurwaarde mee: #FF8A00.

          In deze code hebben we echter een kleurwaarde als de deze nodig: rgb(255, 138, 0), hierin staat de eerste waarde voor de hoeveelheid rood, de tweede voor de hoeveelheid groen, en zo verder.
          
          Eerst voeren we een slice functie uit op de kleurwaarde die we krijgen door de slider. Dit betekent dat er een specifiek deel uit een geheel wordt geknipt, gekopieert of geselecteert.
          
          Daarna voeren we een parse functie uit. Dit betekent dat de geselecteerde waardes, die nog hexadecimaal zijn (dit zijn deze tekens: 0 1 2 3 4 5 6 7 8 9 A B C D E F), omzetten naar een normaal decimaal getal. 

          Deze kunnen we dan verder gebruiken in de code. 
          `,
      },
      {
        name: "text",
        label: "Tekst",
        type: "text",
        default: "Hello",
        explanation: `Het woord 'text' staat hier voor het woord dat ingetypt wordt. Je stelt dat woord in de code voor als 'word', zodat je er in de code makkelijk naar kan verwijzen. 
          
        Hetzelfde doe je voor de ruimte tussen de bolletjes, de bolletjes die de letters opbouwen, de spacing dus.
          
          Daarna roep je de functie op die de bolletjes opstelt en hierin vermeld je het woord en de spacing.`,
        codeSnippet: `state.word = text;
  state.lastSpacing = spacing;
  state.dots = buildDots(state.word, spacing);`,
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
