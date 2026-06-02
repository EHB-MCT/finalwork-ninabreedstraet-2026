import type { ReactNode } from "react";

export type ParamType = "range" | "color" | "image" | "text";

export interface SketchParam {
  codeSnippet: ReactNode;
  explanation: string | ReactNode;
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
  previewImage: string;
  useP5?: boolean;
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
        label: "Drempel",
        type: "range",
        min: 0,
        max: 100,
        step: 1,
        default: 30,
        codeSnippet: ` 
const bn = (d[i]*299 + d[i+1]*587 + d[i+2]*114) / 1000 / 2.55;
if (bn > threshold) break;
y++;`,
        explanation: (
          <>
            <em>
              const bn = (d[i]*299 + d[i+1]*587 + d[i+2]*114) / 1000 / 2.55
            </em>{" "}
            Dit berekent hoe helder een pixel is, een getal tussen 0 (zwart) en
            100 (wit).
            <br />
            <br />
            <em>d</em> is de lijst van alle pixelwaarden van de afbeelding,
            eerder opgeslagen als <em>state.d</em> is de lijst van alle
            pixelwaarden van de afbeelding die eerder opgeslagen is. Het is
            gewoon een lange rij getallen waarbij elke 4 getallen samen één
            pixel voorstellen.
            <br />
            <br />
            <em>d[i]</em> is de rode waarde van de pixel, <em>d[i+1]</em> de
            groene en <em>d[i+2]</em> de blauwe. Elke pixel in de array heeft
            dus 4 plekjes naast elkaar: rood, groen, blauw en transparantie. De
            getallen 299, 587 en 114 zijn gewichten die bepalen hoe zwaar elke
            kleur meetelt voor de helderheid. Groen telt het zwaarst mee omdat
            ons oog daar het gevoeligst voor is.
            <br />
            <br />
            <em>if (bn &gt; threshold) break</em>: Dit is een if-statement, je
            zegt hier: als hetgeen tussen de haakjes klopt, voer dan deze
            opdracht uit. De opdracht staat dan meestal tussen collades eronder,
            hier staat de opdracht ernaast. Als de pixel te licht is, stop dan
            met verder gaan. y++: Ga één pixel naar beneden.
          </>
        ),
      },
      {
        name: "image",
        label: "Afbeelding",
        type: "image",
        default:
          "https://m.media-amazon.com/images/I/81nFcvY8zIL._AC_UF1000,1000_QL80_.jpg",
        codeSnippet: `
const img = new Image();
img.src = image;
`,
        explanation: (
          <>
            <em>new Image()</em> maakt een leeg afbeelding-object aan in de
            browser en <em>img.src = image</em> vertelt hem welke afbeelding hij
            moet laden door de URL in te stellen.
            <br />
            <br />
            Een object is een container voor meerdere waarden die bij elkaar
            horen, je groepeert ze onder één naam.
          </>
        ),
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
    previewImage: "/Images/pixelsorting.png",
  },
  {
    id: "gradient",
    name: "Gradiënt",
    desc: "Vloeiende kleurcirkels volgen je muis en stoten elkaar af op een gradiëntachtergrond.",
    animate: true,
    params: [
      {
        name: "color1",
        label: "Kleur 1",
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
        explanation: (
          <>
            <em>hexToRgb</em> Dit is een functie die een hexkleur zoals #FF8A00
            opsplitst in drie losse getallen: rood, groen en blauw. Die drie
            getallen worden teruggegeven als een lijstje [r, g, b].
            <br /> <br />
            <em>colorAt(x)</em> Dit geeft de kleur terug op een bepaalde
            x-positie op het scherm. Het scherm heeft drie kleuren (color1,
            color2, color3) die vloeiend in elkaar overlopen van links naar
            rechts.
            <br /> <br />
            <em>const amt = Math.max(0, Math.min(1, x / W))</em> Dit berekent
            hoe ver je bent op het scherm als een getal tussen 0 en 1. Helemaal
            links is 0, helemaal rechts is 1.
            <br /> <br />
            <em>if (amt 0.5) return lerpRgb(c1, c2, amt * 2)</em> Dit is een
            if-statement, je zegt hier: als hetgeen tussen de haakjes klopt,
            voer dan deze opdracht uit. De opdracht staat dan meestal tussen
            collades eronder. Als je in de linkerhelft van het scherm zit, mix
            je tussen kleur 1 en kleur 2.
            <br />
            <br />
            <em>return lerpRgb(c2, c3, (amt - 0.5) * 2)</em> In de rechterhelft
            mix je tussen kleur 2 en kleur 3.
          </>
        ),
      },
      {
        name: "color2",
        label: "Kleur 2",
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
        explanation: (
          <>
            <em>hexToRgb</em> Dit is een functie die een hexkleur zoals #FF8A00
            opsplitst in drie losse getallen: rood, groen en blauw. Die drie
            getallen worden teruggegeven als een lijstje [r, g, b].
            <br /> <br />
            <em>colorAt(x)</em> Dit geeft de kleur terug op een bepaalde
            x-positie op het scherm. Het scherm heeft drie kleuren (color1,
            color2, color3) die vloeiend in elkaar overlopen van links naar
            rechts.
            <br /> <br />
            <em>const amt = Math.max(0, Math.min(1, x / W))</em> Dit berekent
            hoe ver je bent op het scherm als een getal tussen 0 en 1. Helemaal
            links is 0, helemaal rechts is 1.
            <br /> <br />
            <em>if (amt 0.5) return lerpRgb(c1, c2, amt * 2)</em> Dit is een
            if-statement, je zegt hier: als hetgeen tussen de haakjes klopt,
            voer dan deze opdracht uit. De opdracht staat dan meestal tussen
            collades eronder. Als je in de linkerhelft van het scherm zit, mix
            je tussen kleur 1 en kleur 2.
            <br />
            <br />
            <em>return lerpRgb(c2, c3, (amt - 0.5) * 2)</em> In de rechterhelft
            mix je tussen kleur 2 en kleur 3.
          </>
        ),
      },
      {
        name: "color3",
        label: "Kleur 3",
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
        explanation: (
          <>
            <em>hexToRgb</em> Dit is een functie die een hexkleur zoals #FF8A00
            opsplitst in drie losse getallen: rood, groen en blauw. Die drie
            getallen worden teruggegeven als een lijstje [r, g, b].
            <br /> <br />
            <em>colorAt(x)</em> Dit geeft de kleur terug op een bepaalde
            x-positie op het scherm. Het scherm heeft drie kleuren (color1,
            color2, color3) die vloeiend in elkaar overlopen van links naar
            rechts.
            <br /> <br />
            <em>const amt = Math.max(0, Math.min(1, x / W))</em> Dit berekent
            hoe ver je bent op het scherm als een getal tussen 0 en 1. Helemaal
            links is 0, helemaal rechts is 1.
            <br /> <br />
            <em>if (amt 0.5) return lerpRgb(c1, c2, amt * 2)</em> Dit is een
            if-statement, je zegt hier: als hetgeen tussen de haakjes klopt,
            voer dan deze opdracht uit. De opdracht staat dan meestal tussen
            collades eronder. Als je in de linkerhelft van het scherm zit, mix
            je tussen kleur 1 en kleur 2.
            <br />
            <br />
            <em>return lerpRgb(c2, c3, (amt - 0.5) * 2)</em> In de rechterhelft
            mix je tussen kleur 2 en kleur 3.
          </>
        ),
      },
      {
        name: "circleCount",
        label: "Aantal cirkels",
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
        explanation: (
          <>
            <em>state.state.circleCount = circleCount</em> Dit slaat het huidige
            aantal cirkels op in het project, zodat de code later kan
            controleren of het aantal veranderd is.
            <br />
            <br />
            <em>
              Array.from(&#123; length: circleCount &#125;, (_, i) =&lt; ...)
            </em>
            Dit maakt een lijst aan van de aantal cirkels die de gebruiker heeft
            aangeduid. Voor elk item wordt de opdracht uitgevoerd, waarbij i het
            volgnummer is (0, 1, 2...). De _ is gewoon een leeg argument dat we
            niet gebruiken.
            <br />
            <br />
            <em>const angle = (i / circleCount) * Math.PI * 2</em> Dit verdeelt
            een volledige cirkel eerlijk over alle cirkels. Als er 4 cirkels
            zijn krijgen ze hoeken 0°, 90°, 180° en 270°.
            <br />
            <br />
            <em>return &#123;, x, y, r, ox, oy &#125;</em> Dit maakt een object
            aan voor elke cirkel met 5 eigenschappen: x en y is de startpositie,
            r is de straal (grootte), ox en oy is de verschuiving door muis of
            botsingen, begint op 0.
            <br />
            <br />
            Een object is een container voor meerdere waarden die bij elkaar
            horen, je groepeert ze onder één naam.
          </>
        ),
      },
      {
        name: "blurAmount",
        label: "Blurriness",
        type: "range",
        min: 1,
        max: 30,
        step: 1,
        default: 10,
        codeSnippet: `ctx.filter = \`blur(\${blurAmount}px)\`;
`,
        explanation: (
          <>
            Het blur-effect pas je normaal toe in de styling, in deze
            programmeertaal wordt het toegepast op{" "}
            <em>de context van het canvas</em>. Dat is wat er wordt bedoeld met
            ctx. Door er een punt achter te zetten en te verwijzen naar de
            filter, verwijs je naar welke filter er op de context/canvas moet
            worden toegepast.
            <br />
            <br />
            Door <em>blur(10px)</em> te doen wordt er een blur-effect toegepast
            op <em>de 10 pixels van de randen van elke cirkel</em>. Het
            dollarteken en de accolade's worden gebruikt om een waarde in een
            tekst te plakken. Als we zonder die opstelling het woord 'size' in
            de code zouden plakken, zou dit niet herkend worden.
            <br />
            <br />
            De slashes worden nu gebruikt zodat ik deze tekens aan jullie kan
            tonen, zondat dat het foutmeldingen geeft in mijn code. Als ik dit
            niet zou doen, zou mijn code verwachten dat hier nog een waarde in
            komt. Terwijl deze code enkel ter demonstratie is.
          </>
        ),
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
    previewImage: "/Images/circles.png",
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
        explanation: (
          <>
            Met const duid je aan dat je een waarde, zoals een cijfer of een
            kleur, wilt koppelen aan een specifiek woord, waardoor het
            makkelijker opgeroepen kan worden in later code.
            <br />
            <br />
            <em>W / spacing</em> berekent hoeveel vakjes er horizontaal passen,
            als het scherm 800px breed is en spacing 20, dan is dat 40.{" "}
            <em>Math.floor</em> rond dat naar beneden af want je kan geen half
            vakje hebben.
            <br />
            <br />
            Hetzelfde geldt voor rows maar dan verticaal met de hoogte H.
            <br />
            <br />
            De spacing is hetgeen de gebruiker met de slider zelf aanpast.
          </>
        ),
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
        explanation: (
          <>
            Met const duid je aan dat je een waarde, zoals een cijfer of een
            kleur, wilt koppelen aan een specifiek woord, waardoor het
            makkelijker opgeroepen kan worden in later code.
            <br />
            <br />
            Je gaat het woord 'size' koppelen aan de effectieve grootte van de
            vakjes. Dit bereken je op deze manier:{" "}
            <em>Math.max(4, maxSize * Math.min(1, dist / (scale * 2)))</em>
            <br />
            <br />
            <b>Laten we dit ontleden:</b>
            <br />
            <br />
            <em>dist / (scale * 2)</em> Dit berekent hoe ver de muis is als een
            verhouding. Als de muis heel dichtbij is, is dit een klein getal.
            Ver weg geeft een groot getal. Scale is dus hetgeen de gebruiker met
            de slider aanduidt.
            <br />
            <br />
            <em>Math.min(1, ...)</em> die verhouding mag nooit groter zijn dan
            1, want anders zou het vierkantje groter worden dan het vakje zelf.
            <br />
            <br />
            <em>vakje</em> = de ruimte die gereserveerd is in het raster voor
            één element, bepaald door spacing.
            <br />
            <br />
            <em>vierkantje</em> = het witte afgeronde vierkant dat binnen dat
            vakje getekend wordt, bepaald door size.
            <br />
            <br />
            <em>maxSize * ...</em> Die verhouding wordt vermenigvuldigd met de
            maximale grootte van het vakje, zodat je de echte grootte in pixels
            krijgt.
            <br />
            <br />
            <em>Math.max(4, ...)</em>: het resultaat mag nooit kleiner zijn dan
            4 pixels, want anders zou het vierkantje bijna onzichtbaar worden.
          </>
        ),
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
    previewImage: "/Images/grid.png",
  },
  {
    id: "ascii",
    name: "ASCII",
    desc: "Een afbeelding omgezet naar ASCII-tekens op basis van helderheid.",
    animate: true,
    params: [
      //       {
      //         name: "size",
      //         label: "tekengrootte",
      //         type: "range",
      //         min: 4,
      //         max: 20,
      //         step: 1,
      //         default: 8,
      //         codeSnippet: `ctx.font = \`\${size}px monospace\`;
      // `,
      //         explanation: (
      //           <>
      //             Aangezien de afbeelding gewoon uit tekens, zoals we op ons
      //             toetsenbord kunnen zien, is opgebouwd, kunnen we de grootte van de
      //             tekens instellen door gewoon <em>de grootte van het lettertype</em>{" "}
      //             in te stellen.
      //             <br />
      //             <br />
      //             Dat is wat je hier ziet. Daarnaast zie je ook veel '\' en een
      //             dollarteken en accolade's.
      //             <br />
      //             <br />
      //             Het dollarteken en de accolade's worden gebruikt om een waarde in
      //             een tekst te plakken. Als we zonder die opstelling het woord{" "}
      //             <em>size</em>
      //             in de code zouden plakken, zou dit niet herkend worden.
      //             <br />
      //             <br />
      //             De slashes worden nu gebruikt zodat ik deze tekens aan jullie kan
      //             tonene, zodat dat het foutmeldingen geeft in mijn code. Als ik dit
      //             niet zou doen, zou mijn code verwachten dat hier nog een waarde in
      //             komt. Terwijl deze code enkel ter demonstratie is.
      //           </>
      //         ),
      //       },
      {
        name: "charset",
        label: "Tekenstijl",
        type: "range",
        min: 0,
        max: 1,
        step: 1,
        default: 0,
        codeSnippet: `const charsets = [
  '█▓▒░ ',
  '#$%&*+=-:;,. ',
];

const baseCharset = charsets[charset];
const hoverCharset = '$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/|()1{}[]?-_+~<>i!lI;:,^. ';

`,
        explanation: (
          <>
            <em>charsets</em> is een lijst (ook wel array genoemd) van twee
            verschillende sets van tekens, van donker naar licht gerangschikt.
            <br />
            <br />
            Die tekens worden later gebruikt om de het beeld te genereren.
            <br />
            <br />
            <em>charsets[charset]</em> Als je een element uit een array wilt
            selecteren dan doe je dat zo: charsets[0]. Dit betekent, ik wil het
            eerste element van de lijst 'charsets' (aangezien een array altijd
            begint bij 0). 'charset' verwijst naar de slider, dit is dus ofwel 0
            of 1.
          </>
        ),
      },
      {
        name: "color1",
        label: "Tekstkleur",
        type: "color",
        default: "#ffffff",
        codeSnippet: `ctx.fillStyle = color1;
`,
        explanation: (
          <>
            <em>ctx</em> staat voor 'context' Je zegt hier dus dat de fillStyle
            van de context, color1 moet zijn. Color1 staat voor de kleur die de
            gebruiker aangeeft door de slider.
          </>
        ),
      },
      {
        name: "image",
        label: "Afbeelding",
        type: "image",
        default:
          "https://m.media-amazon.com/images/I/81nFcvY8zIL._AC_UF1000,1000_QL80_.jpg",
        codeSnippet: `
const img = new Image();
img.src = image;
`,
        explanation: (
          <>
            <em>new Image()</em> maakt een leeg afbeelding-object aan in de
            browser en <em>img.src = image </em> vertelt hem welke afbeelding
            hij moet laden door de URL in te stellen.
            <br />
            <br />
            Een object is een container voor meerdere waarden die bij elkaar
            horen, je groepeert ze onder één naam.
          </>
        ),
      },
    ],
    paramDocs: {
      size: "De grootte van elk ASCII-teken in pixels. Kleinere waarden geven meer detail.",
      charset:
        "0 = blokken (█▓▒░), 1 = symbolen (#$%&*), 2 = gedetailleerd ($@B%8&...)",
      color1: "De kleur van de ASCII-tekens.",
    },
    code: `const charsets = [
  '█▓▒░ ',
  '#$%&*+=-:;,. ',
];

const baseCharset = charsets[charset];
const hoverCharset = '$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/|()1{}[]?-_+~<>i!lI;:,^. ';

if (!state.ready) {
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.src = image;

  img.onload = () => {
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

const cellW = W / imgW;
const cellH = H / imgH;

ctx.fillStyle = color1;
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.font = Math.max(cellW, cellH) + 'px monospace';

for (let i = 0; i < imgW; i++) {
  for (let j = 0; j < imgH; j++) {

    const idx = (i + j * imgW) * 4;

    const r = d[idx];
    const g = d[idx + 1];
    const b = d[idx + 2];

    const bright = (r + g + b) / 3;

    const tIndex = Math.floor(
      (bright / 255) * (baseCharset.length - 1)
    );

    const x = i * cellW + cellW / 2;
    const y = j * cellH + cellH / 2;

    const dx = mouse.x - x;
    const dy = mouse.y - y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    const isHover = dist < Math.max(cellW, cellH) * 0.6;

    const charset = isHover ? hoverCharset : baseCharset;
    const ch = charset[tIndex];

    ctx.fillText(ch, x, y);
  }
}`,
    previewImage: "/Images/ascii.png",
  },
  {
    id: "dottext",
    name: "Stippeltekst",
    desc: "Typ een woord en zie het verschijnen als stippen die reageren op je muis.",
    animate: true,
    params: [
      {
        name: "spacing",
        label: "Stippelgrootte",
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
        explanation: (
          <>
            Hier stel je het woord dots gelijk aan de effectieve bolletjes die
            je zal zien verschijnen op het scherm. Door het woord hieraan te
            verbinden, wordt het makkelijker om deze later in de code te
            gebruiken.
            <br />
            <br />
            <em>buildDots</em> is hetgeen dat de bolletjes aanmaakt, dit noemen
            ze een functie. Deze functie heeft twee elementen nodig, het woord
            dat de bolletjes moeten vormen en de grootte van de bolletjes.
            <br />
            <br />
            Verder zie je twee <em>for-loops</em> staan. for-loops ga je
            gebruiken als je wilt dat er bepaalde elementen zich moeten
            herhalen. Als je een rij van vakjes wilt, gebruik je een for-loop.
            Als je een raster/grid wilt, gebruik je twee for-loops in elkaar,
            zodat de verticale rijen zich ook horizontaal herhalen, of
            omgekeerd.
            <br />
            <br />
            Je ziet in de eerste for-loop dus duidelijk de <em>y</em> en in de
            tweede functie duidelijk de <em>x</em>. De <em>W</em> en <em>H</em>{" "}
            staan dan voor width en height.
            <br />
            <br />
            Als je meer wilt leren over hoe for-loops in elkaar steken, kijk dan
            zeker naar de oefeningen!
          </>
        ),
      },
      {
        name: "mouseRadius",
        label: "Muisstraal",
        type: "range",
        min: 20,
        max: 200,
        step: 10,
        default: 80,
        codeSnippet: `const influence = Math.max(0, 1 - dist / mouseRadius);
`,
        explanation: (
          <>
            Hier berekenen we de invloed die de muis heeft op de bolletjes. Met
            'invloed' wordt er verwezen naar hoe groot de straal is van het
            oppervlak onder de muis, waar de bolletjes groter worden.
            <br />
            <br />
            <em>dist</em> is de afstand tussenhet bolletje en de muis.
            mouseRadius wordt ingesteld door de gebruiker met de slider en
            bepaalt dus hoe groot die straal is.
            <br />
            <br />
            <em>dist / mouseRadius</em> berekent hoe ver de muis is als een
            verhouding: als de muis op de rand van de cirkel zit is dat 1, als
            hij er middenin zit is dat 0.
            <br />
            <br />
            Door <em>1 -</em> ervoor te zetten draai je dat om: dicht bij de
            muis = hoge influence, ver weg = lage influence.
            <br />
            <br />
            De <em>Math.max(0, ...)</em> zorgt ervoor dat de influence nooit
            negatief wordt als de muis buiten de cirkel is.
          </>
        ),
      },
      {
        name: "maxGrow",
        label: "Max groei",
        type: "range",
        min: 5,
        max: 50,
        step: 1,
        default: 26,
        codeSnippet: `const targetR = d.baseR + influence * maxGrow`,
        explanation: (
          <>
            Met const duid je aan dat je een waarde, zoals een cijfer of een
            kleur, wilt koppelen aan een specifiek woord, waardoor het
            makkelijker opgeroepen kan worden in later code.
            <br />
            <br />
            Hier gaan we de target-radius berekenen, met target wordt de muis
            bedoeld. Met de radius wordt er verwezen naar{" "}
            <em>straal van de oppervlakte waar de muis invloed op heeft</em>.
            <br />
            <br />
            Nu gaan we over naar de berekening. <em>d.baseR</em> staat voor de
            normale straal van de bolletjes die letters opmaken, de influence
            staat voor de invloed die de muis heeft en de maxGrow is hetgeen de
            gebruiker instelt aan de hand van de sliders en verwijst dus naar de
            maximale grootte van de bolletjes.
            <br />
            <br />
            Je doet influence maal de maxGrow om te berekenen hoeveel het
            bolletje extra groeit op basis van hoe dicht de muis is, daar tel je
            dan de basis groote van het bolletje bij op.
          </>
        ),
      },
      {
        name: "color1",
        label: "Kleur",
        type: "color",
        default: "#4db43c",
        codeSnippet: `const r0 = parseInt(color1.slice(1,3),16);
const g0 = parseInt(color1.slice(3,5),16);
const b0 = parseInt(color1.slice(5,7),16);`,
        explanation: (
          <>
            Met const duid je aan dat je een waarde, zoals een cijfer of een
            kleur, wilt koppelen aan een specifiek woord, waardoor het
            makkelijker opgeroepen kan worden in later code.
            <br />
            <br />
            Hier zie je dus een <em>const</em> met r, g en b. Dit staat voor:
            rood, groen en blauw.
            <br />
            <br />
            <em>Color1</em> stelt de waarde voor die de gebruiker aanduidt met
            de slider. Een kleurwaarde kan je op verschillende manier
            voorstellen, hier geeft de slider dit soort kleurwaarde mee:{" "}
            <em>#FF8A00</em>.
            <br />
            <br />
            In deze code hebben we echter een kleurwaarde als de deze nodig:
            <em>rgb(255, 138, 0)</em>, hierin staat de eerste waarde voor de
            hoeveelheid rood, de tweede voor de hoeveelheid groen, en zo verder.
            <br />
            <br />
            Eerst voeren we een slice functie uit op de kleurwaarde die we
            krijgen door de slider. Dit betekent dat er{" "}
            <em>
              een specifiek deel uit een geheel wordt geknipt, gekopieert of
              geselecteert
            </em>
            .
            <br />
            <br />
            Daarna voeren we een parse functie uit. Dit betekent dat de
            geselecteerde waardes, die nog hexadecimaal zijn (dit zijn deze
            tekens: 0 1 2 3 4 5 6 7 8 9 A B C D E F), omzetten naar een normaal
            decimaal getal.
            <br />
            <br />
            Deze kunnen we dan verder gebruiken in de code.
          </>
        ),
      },
      {
        name: "text",
        label: "Tekst",
        type: "text",
        default: "Hello",
        explanation: (
          <>
            Het woord <em>text</em> staat hier voor het woord dat ingetypt
            wordt. Je stelt dat woord in de code voor als 'word', zodat je er in
            de code makkelijk naar kan verwijzen.
            <br />
            <br />
            Hetzelfde doe je voor de ruimte tussen de bolletjes, de bolletjes
            die de letters opbouwen, de spacing dus.
            <br />
            <br />
            Daarna roep je de functie op die de bolletjes opstelt en hierin
            vermeld je het woord en de spacing.
          </>
        ),
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
    previewImage: "/Images/letters.png",
  },
  {
    id: "grid3d",
    useP5: true,
    name: "3D Grid",
    desc: "Een 3D-raster van vormen die groter worden naarmate ze dichter bij het midden zitten. Draai met je muis.",
    animate: true,
    params: [
      {
        name: "num",
        label: "Aantal",
        type: "range",
        min: 1,
        max: 15,
        step: 1,
        default: 5,
        codeSnippet: `for (let i = 0; i < num; i++) {
  for (let j = 0; j < num; j++) {
    for (let k = 0; k < num; k++) {
      // Hier staat de rest van de code normaal gezien, die kan je zien als je op de knop 'Toon heel de code' klikt.
    }
  }
}`,
        explanation: (
          <>
            Hier zie je drie <em>for-loops</em> staan. for-loops ga je gebruiken
            als je wilt dat er bepaalde elementen zich moeten herhalen. Als je
            een rij van bollen wilt, gebruik je een for-loop. Als je een
            raster/grid wilt, gebruik je twee for-loops in elkaar, zodat de
            verticale rijen zich ook horizontaal herhalen, of omgekeerd.
            <br />
            <br />
            Hier gebruik je drie <em>for-loops</em> in elkaar om een 3D-raster
            te maken. De eerste loop gaat over de x-as, de tweede over de y-as
            en de derde over de z-as.
            <br />
            <br />
            <em>num</em> bepaalt hoeveel vormen er op elke as staan. Als num 5
            is, krijg je 5×5×5 = 125 vormen in totaal.
          </>
        ),
      },
      {
        name: "divider",
        label: "Verhouding",
        type: "range",
        min: 1,
        max: 15,
        step: 0.5,
        default: 5,
        codeSnippet: `const s = Math.max(1, spacing - distance / divider);`,
        explanation: (
          <>
            <em>distance</em> Dit is hoe ver een vorm van het middelpunt staat.
            <br />
            <br />
            <em>distance / divider</em> Dit deelt de afstand tot het centrum
            door de divider om te bepalen hoeveel de grootte afneemt. Een
            grotere divider wilt zeggen dat de vormen dezelfde grootte blijven,
            een kleinere divider wilt zeggen dat de grootte afneemt, naarmate de
            afstand van het centrum.
            <br />
            <br />
            Door die afstand te delen door <em>divider</em> bepaal je hoe snel
            de vormen kleiner worden richting de randen. Een grotere waarde =
            vormen worden minder snel kleiner.
          </>
        ),
      },
      {
        name: "shape",
        label: "Vorm",
        type: "range",
        min: 0,
        max: 6,
        step: 1,
        default: 1,
        codeSnippet: `const shapes = ['torus', 'sphere', 'cylinder', 'plane', 'box', 'cone', 'ellipsoid'];
const shapeName = shapes[Math.floor(shape)];

if (shapeName === 'torus') p.torus(s, s * 0.4, 6, 4);
else if (shapeName === 'sphere') p.sphere(s, 6, 4);`,
        explanation: (
          <>
            <em>shapes</em> is een lijst (wordt ook een 'array' genoemd) van
            alle beschikbare 3D-vormen. Op basis van het getal dat de gebruiker
            kiest via de slider, wordt de bijhorende vorm geselecteerd.
            <br />
            <br />
            Het woordt 'shape' staat hier voor de slider. Het getal dat uit de
            slider komt, wordt dus geïmplementeerd op de plaats waar 'shape'
            staat.
            <br />
            <br />
            <em>Math.floor</em> zorgt ervoor dat het getal altijd naar beneden
            wordt afgerond zodat je altijd een geldige index krijgt. Dit kan je
            onthouden door dat het getal altijd naar de vloer (floor) wordt
            getrokken.
            <br />
            <br />
            Het getal dat uit de slider komt kan bijvoorbeeld '1,3 'zijn, als we
            hier dan <em>Math.floor</em> voorzetten, wordt dit '1'.
          </>
        ),
      },
      {
        name: "material",
        label: "Materiaal",
        type: "range",
        min: 0,
        max: 3,
        step: 1,
        default: 0,
        codeSnippet: `const materials = ['normalMaterial', 'ambientMaterial', 'specularMaterial', 'emissiveMaterial'];
const matName = materials[Math.floor(material)];

if (matName === 'normalMaterial') p.normalMaterial();
else if (matName === 'ambientMaterial') p.ambientMaterial(150, 100, 200);
// ...`,
        explanation: (
          <>
            Het <em>materiaal</em> bepaalt hoe de vormen licht weerkaatsen.
            <br />
            <br />
            <em>normalMaterial</em> Dit kleurt elk vlakje van een 3D-object op
            basis van de richting het vlakje "uitkijkt": <br />
            naar rechts/links: rood
            <br />
            naar voor/achter: groen
            <br />
            naar boven/onder: blauw
            <br />
            <br />
            <em>ambientMaterial</em> reageert op omgevingslicht. We hebben geen
            lichtbron toegevoegd, dus dit wordt gewoon wit.
            <br />
            <br />
            <em>specularMaterial</em> geeft glanzende highlights.
            <br />
            <br />
            <em>emissiveMaterial</em> straalt zelf licht uit, onafhankelijk van
            lichtbronnen.
          </>
        ),
      },
    ],
    paramDocs: {
      num: "Aantal vormen per as. 5 = 5×5×5 = 125 vormen.",
      divider: "Hoe snel vormen kleiner worden naar de randen toe.",
      shape:
        "0=torus, 1=sphere, 2=cylinder, 3=plane, 4=box, 5=cone, 6=ellipsoid",
      material:
        "0=normalMaterial, 1=ambientMaterial, 2=specularMaterial, 3=emissiveMaterial",
    },
    code: `
const shapes = ['torus', 'sphere', 'cylinder', 'plane', 'box', 'cone', 'ellipsoid'];
const materials = ['normalMaterial', 'ambientMaterial', 'specularMaterial', 'emissiveMaterial'];
const shapeName = shapes[Math.min(Math.floor(shape), shapes.length - 1)];
const matName = materials[Math.min(Math.floor(material), materials.length - 1)];
const spacing = 25;

p.background(220);
p.orbitControl();
p.ambientLight(100);
p.directionalLight(255, 255, 255, 0, -1, -1);

for (let i = 0; i < num; i++) {
  for (let j = 0; j < num; j++) {
    for (let k = 0; k < num; k++) {
      p.push();
      const offset = (-spacing * num) / 2 + spacing / 2;
      const x = i * spacing + offset;
      const y = j * spacing + offset;
      const z = k * spacing + offset;
      const distance = p.sqrt(p.pow(x,2) + p.pow(y,2) + p.pow(z,2));
      const s = Math.max(1, spacing - distance / divider);
      p.translate(x, y, z);

      if (matName === 'normalMaterial') p.normalMaterial();
      else if (matName === 'ambientMaterial') p.ambientMaterial(150, 100, 200);
      else if (matName === 'specularMaterial') { p.specularMaterial(200, 150, 50); p.shininess(50); }
      else if (matName === 'emissiveMaterial') p.emissiveMaterial(100, 180, 255);

      if (shapeName === 'torus') p.torus(s, s * 0.4, 6, 4);
      else if (shapeName === 'sphere') p.sphere(s, 6, 4);
      else if (shapeName === 'cylinder') p.cylinder(s, s * 1.2, 6);
      else if (shapeName === 'plane') p.plane(s * 2, s * 2);
      else if (shapeName === 'box') p.box(s * 1.5);
      else if (shapeName === 'cone') p.cone(s, s * 2, 6);
      else if (shapeName === 'ellipsoid') p.ellipsoid(s, s * 1.5, s * 0.8, 6, 4);

      p.pop();
    }
  }
}
`,
    previewImage: "/Images/3D.png",
  },
  {
    id: "tilemirror",
    useP5: true,
    name: "Tegel Spiegel",
    desc: "Een afbeelding wordt opgedeeld in tegels die gespiegeld of willekeurig geroteerd worden op basis van je muispositie.",
    animate: true,
    params: [
      {
        name: "size",
        label: "Tegelgrootte",
        type: "range",
        min: 10,
        max: 80,
        step: 5,
        default: 20,
        codeSnippet: `const cols = Math.floor(W / size);
      const rows = Math.floor(H / size);
`,
        explanation: (
          <>
            <em>size</em> bepaalt hoe groot elke tegel is in pixels. De
            afbeelding wordt opgedeeld in een raster van tegels van size × size
            pixels.
            <br />
            <br />
            <em>cols</em> en <em>rows</em> berekenen hoeveel tegels er
            horizontaal en verticaal passen. <em>Math.floor()</em> rond het
            getal dat tussen de haakjes staat naar beneden af.
            <br />
            <br />
            <em>W</em> en <em>H</em> staan voor de breedte en hoogte van het
            scherm, je zegt dus: hoeveel kolommen en hoeveel rijen passen er op
            het scherm als de vakjes de grootte van 'size' hebben. 'size'
            verwijst dan naar de waarde die jij ingeeft met de slider.
          </>
        ),
      },
      {
        name: "mode",
        label: "Modus",
        type: "range",
        min: 0,
        max: 4,
        step: 1,
        default: 4,
        codeSnippet: `if (mode === 0) {
      p.image(tile, 0, 0);                    // normaal
    } else if (mode === 1) {
      p.scale(-1, 1);
      p.image(tile, -size, 0);
    } else if (mode === 2) {
      p.scale(1, -1);              
      p.image(tile, 0, -size);               // horizontaal gespiegeld
    } else if (mode === 3) {
      p.scale(-1, -1);
      p.image(tile, -size, -size);          // verticaal gespiegeld  
    } else {
      if (i > mx / size) {
        p.translate(size / 2, size / 2);
        p.rotate(state.rotations[i][j]);    // beide gespiegeld
        p.image(tile, -size / 2, -size / 2);
      } else {
        p.image(tile, 0, 0);
      }
    }`,
        explanation: (
          <>
            Je gebruikt hier if-statements, daarme zeg je: als 'mode' (dit is de
            waarde van slider die jij ingeeft) 0 is, voer dan de opdracht uit
            tussen de accolades. Maar als de 'mode' 1 is voer dan hetgeen dat
            tussen die accolades staat, en zo verder.
            <br />
            <br />
            Er zijn 5 modi (0–4):
            <br />
            <br />
            <em>0</em> = normaal, elke tegel staat rechtop.
            <br />
            <em>1</em> = horizontaal gespiegeld met <em>p.scale(-1, 1)</em>.
            <br />
            <em>2</em> = verticaal gespiegeld met <em>p.scale(1, -1)</em>.
            <br />
            <em>3</em> = beide assen gespiegeld.
            <br />
            <em>4</em> = muismodus: tegels rechts van je muis krijgen een
            willekeurige rotatie (0°, 90°, 180° of 270°), links blijven ze
            normaal.
            <br />
            <br />
            <em>p.scale()</em> spiegelt door een negatieve schaalfactor te
            gebruiken. Daarna moet je de afbeelding verschuiven met een
            negatieve offset zodat hij weer op de juiste plek staat.
          </>
        ),
      },
      {
        name: "image",
        label: "Afbeelding",
        type: "image",
        default: "/Images/natuur.jpeg",
        codeSnippet: `p.loadImage(
    image,
    (loadedImg) => { 
    // hier komt de rest van de code
     state.ready = true;

      }`,
        explanation: (
          <>
            <em>p.loadImage()</em> laadt de afbeelding. Zodra de afbeelding
            klaar is met laden, wordt er aangeduid dat deze actie klaar is,
            daarom: de status van 'ready' is true.
            <br />
            <br />
            <em>Ready</em> is een boolean, dit wilt zeggen dat die enkel 'true'
            of 'false' kan zijn. Ready is het woord en 'true' of 'false' is de
            waarde die je hieraan meegeeft.
            <br />
            <br />
            Eerder in de code zeggen we dus dat we met het woord 'Ready', de
            waarde 'false' meegeven. Dit verandert dus enkel als de afbeelding
            geladen is. Hierdoor weet de rest van de code dat ze enkel dan pas
            verder uitgevoerd kan worden.
          </>
        ),
      },
    ],
    paramDocs: {
      size: "Grootte van elke tegel in pixels. Kleiner = meer detail, meer tegels.",
      mode: "0=normaal, 1=horizontaal gespiegeld, 2=verticaal gespiegeld, 3=beide gespiegeld, 4=muismodus",
    },
    code: `const paramsChanged =
  state.lastImage !== image ||
  state.lastSize !== size;
 
if (state.loading) return;
 
if (!state.ready || paramsChanged) {
  state.ready = false;
  state.loading = true;
  state.lastImage = image;
  state.lastSize = size;
  state.tiles = null;
  state.rotations = null;
 
  p.loadImage(
    image,
    (loadedImg) => {
      loadedImg.resize(W, 0);
      const cols = Math.floor(W / size);
      const rows = Math.floor(H / size);
 
      // tiles opbouwen
      const tiles = [];
      for (let i = 0; i < cols; i++) {
        tiles[i] = [];
        for (let j = 0; j < rows; j++) {
          tiles[i][j] = loadedImg.get(i * size, j * size, size, size);
        }
      }
 
      const rotations = [];
      for (let i = 0; i < cols; i++) {
        rotations[i] = [];
        for (let j = 0; j < rows; j++) {
          rotations[i][j] = p.floor(p.random(4)) * 90;
        }
      }
 
      state.tiles = tiles;
      state.rotations = rotations;
      state.cols = cols;
      state.rows = rows;
      state.ready = true;
      state.loading = false;
    },
    () => {
      state.loading = false;
    }
  );
  return;
}
 
if (!state.tiles) return;
 
const mx = mouse.x ?? W / 2;
 
for (let i = 0; i < state.cols; i++) {
  for (let j = 0; j < state.rows; j++) {
    const tile = state.tiles[i][j];
    if (!tile) continue;
 
    const x = i * size;
    const y = j * size;
 
    p.push();
    p.translate(x, y);
 
    if (mode === 0) {
      p.image(tile, 0, 0);
    } else if (mode === 1) {
      p.scale(-1, 1);
      p.image(tile, -size, 0);
    } else if (mode === 2) {
      p.scale(1, -1);
      p.image(tile, 0, -size);
    } else if (mode === 3) {
      p.scale(-1, -1);
      p.image(tile, -size, -size);
    } else {
      if (i > mx / size) {
        p.translate(size / 2, size / 2);
        p.rotate(state.rotations[i][j]);
        p.image(tile, -size / 2, -size / 2);
      } else {
        p.image(tile, 0, 0);
      }
    }
 
    p.pop();
  }
}
 `,
    previewImage: "/Images/tilemirror.png",
  },
  {
    id: "metaballs",
    useP5: true,
    name: "Metaballs",
    desc: "Bewegende bellen maken vloeiende vormen via marching squares. De lijnen reageren op je muis.",
    animate: true,
    params: [
      {
        name: "bubbleCount",
        label: "Aantal bellen",
        type: "range",
        min: 1,
        max: 30,
        step: 1,
        default: 15,
        codeSnippet: `for (let i = 0; i < bubbleCount; i++) {
  bubbles.push({ 
    x: p.random(W), y: p.random(H),
    r: p.random(10, 150),
    vx: p.random(-2, 2), vy: p.random(-2, 2)
  });
}`,
        explanation: (
          <>
            Hier zie je een <em>for-loop</em> staan. Een for-loop ga je
            gebruiken als je wilt dat er bepaalde elementen zich moeten
            herhalen. Als je een rij van bellen wilt, gebruik je een for-loop.
            <br />
            <br />
            Met de <em>for-loop</em> maken we een lijst van bellen aan, die
            lijst noemt 'bubbels'. Elke bel die wordt aangemaakt wordt geduwt in
            die lijst, daarom: bubbles.push.
            <br />
            <br />
            Met de functie <em>p.random()</em> kunnen we een random getal
            genereren. Hetgeen dat tussen de haakjes komt is de max. Je zegt
            dus: geef mij een random getal en het mag niet hoger zijn dan het
            getal tussen de haakjes. W en H staan voor de width en height van
            het scherm.
            <br />
            <br />
            Als er twee getallen staan tussen de haakjes, zeg je: geef mij een
            random getal en het moet tussen die twee getallen liggen.
            <br />
            <br />
            Elke bel heeft een willekeurige startpositie (<em>x</em>, <em>y</em>
            ) en een straal <em>r</em> die bepaalt hoe sterk hij andere punten
            beïnvloedt, en een snelheid (<em>vx</em>, <em>vy</em>) om te
            bewegen.
          </>
        ),
      },
      {
        name: "strokeSize",
        label: "lijndikte",
        type: "range",
        min: 1,
        max: 20,
        step: 1,
        default: 6,
        codeSnippet: `p.strokeWeight(strokeSize);`,
        explanation: (
          <>
            <em>p.strokeWeight()</em> stelt de dikte van de lijnen in pixels in.
            Hoe groter het getal, hoe dikker de contouren.
          </>
        ),
      },
      {
        name: "color1",
        label: "kleur 1",
        type: "color",
        default: "#ff6b6b",
        codeSnippet: `function gradientAt(t) {
  const c0 = hexToRgb(color1);
  const c1 = hexToRgb(color2);
  const c2 = hexToRgb(color3);
  if (t <= 0.5) {
    const s = t / 0.5;
    return lerpRgb(c0, c1, s);
  } else {
    const s = (t - 0.5) / 0.5;
    return lerpRgb(c1, c2, s);
  }
}`,
        explanation: (
          <>
            Hier maken we een eigen functie, dit betekent dat wij een opdracht
            opstellen waarvan we later in de code kunnen vragen of die
            uitgevoerd kan worden. Hoe steekt een functie in elkaar? We zeggen
            eerst dat het een functie is door 'function', daarna geven we die
            functie zelf een naam, hier is dat 'gradientAt', maar dit kan dus
            ook 'blablabla' zijn. Alles wat tussen de haakjes komt, kunnen we
            later invullen. We kunnen dus zeggen: Ik wil dat deze functie wordt
            uitgevoerd met het getal 5, door zo de functie op te roepen:
            gradientAt(5). Dan wordt 't' overal in de code '5'.
            <br />
            <br />
            Met <em>c0, c1 en c2</em> gaan we de drie kleuren benoemen. De
            kleurwaarde die uit de slider komt is een HEX-waarde (dit is
            bijvoorbeeld de HEX-waarde van zwart: #000000). Voor deze code
            hebben we een RGB-waarde nodig (dit is de RGB-waarde voor zwart:
            rgb(0, 0,0)). RGB staat voor rood, groen, blauw. We hebben dus de
            functie <em>hexToRgb()</em> nodig om die waarde om te zetten naar
            hetgeen we nodig hebben.
            <br />
            <br />
            Hierna zie je if-statements, hiermee zeg je: als hetgeen tussen de
            haakjes klopt, voer dan hetgeen uit dat tussen de accolades staat.
            Voer anders uit wat tussen de accolades staat die naast 'else'
            staan.
            <br />
            <br />
            Wat gebeurt er door de if-statements?: Van t=0 tot t=0.5 loopt de
            kleur van kleur 1 naar kleur 2, van t=0.5 tot t=1 van kleur 2 naar
            kleur 3.
            <br />
            <br />
            <em>lerpRgb</em> mengt twee kleuren vloeiend.
          </>
        ),
      },
      {
        name: "color2",
        label: "kleur 2",
        type: "color",
        default: "#6b6bff",
        codeSnippet: `function gradientAt(t) {
  const c0 = hexToRgb(color1);
  const c1 = hexToRgb(color2);
  const c2 = hexToRgb(color3);
  if (t <= 0.5) {
    const s = t / 0.5;
    return lerpRgb(c0, c1, s);
  } else {
    const s = (t - 0.5) / 0.5;
    return lerpRgb(c1, c2, s);
  }
}`,
        explanation: (
          <>
            Hier maken we een eigen functie, dit betekent dat wij een opdracht
            opstellen waarvan we later in de code kunnen vragen of die
            uitgevoerd kan worden. Hoe steekt een functie in elkaar? We zeggen
            eerst dat het een functie is door 'function', daarna geven we die
            functie zelf een naam, hier is dat 'gradientAt', maar dit kan dus
            ook 'blablabla' zijn. Alles wat tussen de haakjes komt, kunnen we
            later invullen. We kunnen dus zeggen: Ik wil dat deze functie wordt
            uitgevoerd met het getal 5, door zo de functie op te roepen:
            gradientAt(5). Dan wordt 't' overal in de code '5'.
            <br />
            <br />
            Met <em>c0, c1 en c2</em> gaan we de drie kleuren benoemen. De
            kleurwaarde die uit de slider komt is een HEX-waarde (dit is
            bijvoorbeeld de HEX-waarde van zwart: #000000). Voor deze code
            hebben we een RGB-waarde nodig (dit is de RGB-waarde voor zwart:
            rgb(0, 0,0)). RGB staat voor rood, groen, blauw. We hebben dus de
            functie <em>hexToRgb()</em> nodig om die waarde om te zetten naar
            hetgeen we nodig hebben.
            <br />
            <br />
            Hierna zie je if-statements, hiermee zeg je: als hetgeen tussen de
            haakjes klopt, voer dan hetgeen uit dat tussen de accolades staat.
            Voer anders uit wat tussen de accolades staat die naast 'else'
            staan.
            <br />
            <br />
            Wat gebeurt er door de if-statements?: Van t=0 tot t=0.5 loopt de
            kleur van kleur 1 naar kleur 2, van t=0.5 tot t=1 van kleur 2 naar
            kleur 3.
            <br />
            <br />
            <em>lerpRgb</em> mengt twee kleuren vloeiend.
          </>
        ),
      },
      {
        name: "color3",
        label: "kleur 3",
        type: "color",
        default: "#6bffb8",
        codeSnippet: `function gradientAt(t) {
  const c0 = hexToRgb(color1);
  const c1 = hexToRgb(color2);
  const c2 = hexToRgb(color3);
  if (t <= 0.5) {
    const s = t / 0.5;
    return lerpRgb(c0, c1, s);
  } else {
    const s = (t - 0.5) / 0.5;
    return lerpRgb(c1, c2, s);
  }
}`,
        explanation: (
          <>
            Hier maken we een eigen functie, dit betekent dat wij een opdracht
            opstellen waarvan we later in de code kunnen vragen of die
            uitgevoerd kan worden. Hoe steekt een functie in elkaar? We zeggen
            eerst dat het een functie is door 'function', daarna geven we die
            functie zelf een naam, hier is dat 'gradientAt', maar dit kan dus
            ook 'blablabla' zijn. Alles wat tussen de haakjes komt, kunnen we
            later invullen. We kunnen dus zeggen: Ik wil dat deze functie wordt
            uitgevoerd met het getal 5, door zo de functie op te roepen:
            gradientAt(5). Dan wordt 't' overal in de code '5'.
            <br />
            <br />
            Met <em>c0, c1 en c2</em> gaan we de drie kleuren benoemen. De
            kleurwaarde die uit de slider komt is een HEX-waarde (dit is
            bijvoorbeeld de HEX-waarde van zwart: #000000). Voor deze code
            hebben we een RGB-waarde nodig (dit is de RGB-waarde voor zwart:
            rgb(0, 0,0)). RGB staat voor rood, groen, blauw. We hebben dus de
            functie <em>hexToRgb()</em> nodig om die waarde om te zetten naar
            hetgeen we nodig hebben.
            <br />
            <br />
            Hierna zie je if-statements, hiermee zeg je: als hetgeen tussen de
            haakjes klopt, voer dan hetgeen uit dat tussen de accolades staat.
            Voer anders uit wat tussen de accolades staat die naast 'else'
            staan.
            <br />
            <br />
            Wat gebeurt er door de if-statements?: Van t=0 tot t=0.5 loopt de
            kleur van kleur 1 naar kleur 2, van t=0.5 tot t=1 van kleur 2 naar
            kleur 3.
            <br />
            <br />
            <em>lerpRgb</em> mengt twee kleuren vloeiend.
          </>
        ),
      },
    ],
    paramDocs: {
      bubbleCount: "Aantal bewegende bellen. Meer bellen = complexere vormen.",
      strokeSize: "Dikte van de contourlijnen in pixels.",
      color1: "Eerste kleur van het kleurverloop over de contouren.",
      color2: "Middelste kleur van het kleurverloop.",
      color3: "Laatste kleur van het kleurverloop.",
    },
    code: `
const thresholds = [0.3, 0.6, 1.0, 1.5, 2.2, 3.2, 4.5];
const rez = 10;

// Helper: hex naar rgb
function hexToRgb(hex) {
  return [
    parseInt(hex.slice(1,3),16),
    parseInt(hex.slice(3,5),16),
    parseInt(hex.slice(5,7),16),
  ];
}

// Helper: lerp tussen twee rgb-kleuren
function lerpRgb(a, b, t) {
  return [
    Math.round(a[0] + (b[0]-a[0])*t),
    Math.round(a[1] + (b[1]-a[1])*t),
    Math.round(a[2] + (b[2]-a[2])*t),
  ];
}

// Kleurverloop over 3 ankerkleuren
function gradientAt(t) {
  const c0 = hexToRgb(color1);
  const c1 = hexToRgb(color2);
  const c2 = hexToRgb(color3);
  if (t <= 0.5) return lerpRgb(c0, c1, t / 0.5);
  return lerpRgb(c1, c2, (t - 0.5) / 0.5);
}

// Initialiseer bellen
if (!state.bubbles || state.lastBubbleCount !== bubbleCount) {
  state.lastBubbleCount = bubbleCount;
  state.bubbles = [];
  // Muisbol
  state.bubbles.push({ x: W/2, y: H/2, r: 80, vx: 0, vy: 0, isMouse: true });
  // Gewone bellen
  for (let i = 0; i < bubbleCount; i++) {
    state.bubbles.push({
      x: p.random(W), y: p.random(H),
      r: p.random(10, 150),
      vx: p.random(-2, 2), vy: p.random(-2, 2),
      isMouse: false,
    });
  }
  // Veld aanmaken
  const cols = Math.floor(1 + W / rez);
  const rows = Math.floor(1 + H / rez);
  state.field = Array.from({ length: cols }, () => new Array(rows).fill(0));
  state.cols = cols;
  state.rows = rows;
}

const { bubbles, field, cols, rows } = state;

// Bellen updaten
for (const b of bubbles) {
  if (b.isMouse) {
    b.x += (mouse.x - b.x) * 0.1;
    b.y += (mouse.y - b.y) * 0.1;
  } else {
    b.x += b.vx;
    b.y += b.vy;
    if (b.x < 0 || b.x > W) b.vx *= -1;
    if (b.y < 0 || b.y > H) b.vy *= -1;
  }
}

// Achtergrond
p.background(200, 210, 220);

// Veld berekenen
for (let i = 0; i < cols; i++) {
  for (let j = 0; j < rows; j++) {
    let sum = 0;
    const x = i * rez;
    const y = j * rez;
    for (const b of bubbles) {
      const dx = x - b.x;
      const dy = y - b.y;
      sum += (b.r * b.r) / (dx * dx + dy * dy);
    }
    field[i][j] = sum;
  }
}

// Marching squares tekenfunctie
function drawLine(v1, v2) {
  p.line(v1.x, v1.y, v2.x, v2.y);
}

function marchingSquares(threshold) {
  for (let i = 0; i < cols - 1; i++) {
    for (let j = 0; j < rows - 1; j++) {
      const x = i * rez;
      const y = j * rez;
      const a = { x: x + rez * 0.5, y: y };
      const b = { x: x + rez, y: y + rez * 0.5 };
      const c = { x: x + rez * 0.5, y: y + rez };
      const d = { x: x, y: y + rez * 0.5 };

      const c1 = field[i][j]     < threshold ? 0 : 1;
      const c2 = field[i+1][j]   < threshold ? 0 : 1;
      const c3 = field[i+1][j+1] < threshold ? 0 : 1;
      const c4 = field[i][j+1]   < threshold ? 0 : 1;
      const st = c1*8 + c2*4 + c3*2 + c4*1;

      if (st===1||st===14) drawLine(c,d);
      else if (st===2||st===13) drawLine(b,c);
      else if (st===3||st===12) drawLine(b,d);
      else if (st===4||st===11) drawLine(a,b);
      else if (st===5) { drawLine(a,d); drawLine(b,c); }
      else if (st===6||st===9) drawLine(a,c);
      else if (st===7||st===8) drawLine(a,d);
      else if (st===10) { drawLine(a,b); drawLine(c,d); }
    }
  }
}

// Contouren tekenen met kleurverloop
p.strokeWeight(strokeSize);
p.noFill();
for (let k = 0; k < thresholds.length - 2; k++) {
  const t = k / (thresholds.length - 1);
  const col = gradientAt(t);
  p.stroke(col[0], col[1], col[2]);
  marchingSquares(thresholds[k]);
}
  `,
    previewImage: "/Images/metaballs.png",
  },
  {
    id: "spirograph",
    useP5: true,
    name: "Spirograaf",
    desc: "Roterende rechthoeken en stippen maken een hypnotiserend patroon dat meebeweegt met de tijd.",
    animate: true,
    params: [
      {
        name: "layers",
        label: "Lagen",
        type: "range",
        min: 10,
        max: 100,
        step: 5,
        default: 100,
        codeSnippet: `for (let i = 0; i < layers; i++) {
  for (let j = 0; j < layers; j++) {
    p.rotate(p.sin(p.frameCount + i) * 100);
    p.rect(0, 0, 600 - i * 3, 600 - i * 3, 200 - i);
  }
}`,
        explanation: (
          <>
            Hier zie je twee <em>for-loops</em> staan. for-loops ga je gebruiken
            als je wilt dat er bepaalde elementen zich moeten herhalen. Als je
            een rij van vakjes wilt, gebruik je een for-loop. Als je een
            raster/grid wilt, gebruik je twee for-loops in elkaar, zodat de
            verticale rijen zich ook horizontaal herhalen, of omgekeerd.
            <br />
            <br />
            De buitenste loop (<em>i</em>) bepaalt dat elke laag een iets
            kleinere rechthoek is en een andere rotatiehoek heeft. Dit wordt
            berekent aan de hand van de sinus-functie <em>p.sin</em>. Je zegt
            hier dus: naarmate de animatie vordert (p.frameCount), wordt de hoek
            vermenigvuldigd met 100.
            <br />
            <br />
            <em>p.rect(0, 0, 600 - i * 3, 600 - i * 3, 200 - i);</em> Hiermee
            zeg je: maak een vierkant met x-positie: 0, y-positie: 0; met
            breedte: "600 - i * 3" en met hoogte: "600 - i * 3"; en met
            afgeronde hoeken met een radius: 200 - i.
          </>
        ),
      },
      {
        name: "baseSize",
        label: "Basisgrootte",
        type: "range",
        min: 2,
        max: 5,
        step: 1,
        default: 2,
        codeSnippet: `p.rect(0, 0, baseSize - i * 3, baseSize - i * 3, 200 - i);`,
        explanation: (
          <>
            <em>baseSize</em> bepaalt hoe groot de buitenste rechthoek is. Elke
            volgende laag (<em>i</em>) wordt met 3 pixels per stap kleiner:{" "}
            <em>baseSize - i * 3</em>. Door "-i" te doen, zeg je ga naar het
            volgende vierkant, dat drie keer kleiner moet zijn.
            <br />
            <br />
            De derde en vierde parameter van <em>p.rect()</em> zijn de breedte
            en hoogte. De vijfde parameter is de afronding van de hoeken, die
            ook afneemt per laag: <em>200 - i</em>.
          </>
        ),
      },
      {
        name: "speed",
        label: "Snelheid",
        type: "range",
        min: 1,
        max: 10,
        step: 1,
        default: 1,
        codeSnippet: `p.rotate(p.sin((p.frameCount * speed) + i) * 100);`,
        explanation: (
          <>
            <em>p.frameCount</em> telt automatisch hoeveel frames er al getekend
            zijn sinds de start. Door dit te vermenigvuldigen met <em>speed</em>{" "}
            gaat de animatie sneller draaien.
            <br />
            <br />
            <em>p.sin()</em> geeft een golvende waarde terug tussen -1 en 1, wat
            zorgt voor de draaibeweging. Hoe hoger de speed, hoe sneller die
            golf beweegt. "Speed" verwijst dan naar de waarde die uit de slider
            komt.
          </>
        ),
      },
      {
        name: "rotationStrength",
        label: "Rotatiekracht",
        type: "range",
        min: 10,
        max: 360,
        step: 10,
        default: 100,
        codeSnippet: `p.rotate(p.sin(p.frameCount + i) * rotationStrength);`,
        explanation: (
          <>
            <em>p.rotate()</em> draait het tekenvlak met een bepaalde hoek. Die
            hoek is de uitkomst van <em>p.sin()</em> (een getal tussen -1 en 1)
            vermenigvuldigd met <em>rotationStrength</em>.
            <br />
            <br />
            Met de berekening 'p.frameCount + i' zeg je dat de frames mogen
            optellen, met frames bedoelen we stilstaande beelden. Als
            stilstaande beelden achterelkaar worden afgespeeld, krijgen we een
            animatie.
            <br />
            <br />
            Hoe hoger de waarde van "rotationStrength" (de waarde die uit de
            slider komt), hoe meer de rechthoeken verder wegdraaien van hun
            startpositie. Bij lage waarden blijven ze bijna recht.
          </>
        ),
      },
    ],
    paramDocs: {
      layers:
        "Aantal lagen rechthoeken en stippen. Meer = complexer maar zwaarder.",
      baseSize: "Grootte van de buitenste rechthoek in pixels.",
      speed: "Animatiesnelheid. Hogere waarden = snellere rotatie.",
      rotationStrength:
        "Hoe ver elke laag roteert. Hogere waarden = wilder patroon.",
    },
    code: `
p.background(10, 20, 30);
p.noFill();
p.translate(W / 2, H / 2);

for (let i = 0; i < layers; i++) {
  for (let j = 0; j < layers; j++) {
    p.push();
    p.rotate(p.sin((p.frameCount * speed) + i) * rotationStrength);

    const r = p.map(p.sin(p.frameCount * speed),       -1, 1, 50, 255);
    const g = p.map(p.cos((p.frameCount * speed) / 2), -1, 1, 50, 255);
    const b = p.map(p.sin((p.frameCount * speed) / 4), -1, 1, 50, 255);
    p.strokeWeight(p.map(i, 0, 100, 4, 0.2));
    p.stroke(r, g, b);
    const size =
              p.max(p.width, p.height) * baseSize -
              i * ((p.max(p.width, p.height) * baseSize) / 100);
    p.rect(0, 0, size, size, 200 - i * 2);
    p.pop();
  }
}
  `,
    previewImage: "/Images/spirograaf.png",
  },
  {
    id: "particles",
    name: "Deeltjes",
    useP5: true,
    animate: true,
    desc: "Deeltjessystemen volgen je muis.",
    previewImage: "/Images/particles.png",
    params: [
      {
        name: "particleCount",
        label: "Cirkeltjes per systeem",
        type: "range",
        min: 10,
        max: 100,
        step: 5,
        default: 50,
        codeSnippet: `for (let i = 0; i < particleCount; i++) {
  particles.push(new Particle(p, x, y));
}`,
        explanation: <>...</>,
      },
      {
        name: "spawnChance",
        label: "Geboortekans",
        type: "range",
        min: 0,
        max: 1,
        step: 1,
        default: 0.3,
        codeSnippet: `if (p.random(100) < spawnChance) {
  state.ps.push(new System(p, mouse.x, mouse.y, particleCount));
}`,
        explanation: <>...</>,
      },
    ],
    paramDocs: {
      particleCount: "Aantal deeltjes per systeem.",
      spawnChance: "Kans (0-100) dat er elk frame een nieuw systeem spawnt.",
    },
    code: `class Particle {
  constructor(p, x, y) {
    this.p = p;
    this.pos = p.createVector(x, y);
    const angle = this.p.random(Math.PI * 2);
    this.vel = p.createVector(p.random(-3, 3), p.random(-3, 3));
    this.vel.mult(p.random(0.2, 0.8));
    const angle2 = p.random(Math.PI * 2);
    this.acc = p.createVector(p.cos(angle2), p.sin(angle2));
    this.acc.mult(p.random(0.05, 0.2));
    this.life = 255;
    this.done = false;
    this.hueValue = 0;
    console.log("vel:", this.vel.x, this.vel.y);
  }

  update() {
  if (this.life < 0) { this.done = true; return; }
  this.done = false;
  const angle = this.p.random(Math.PI * 2);
  this.acc = p.createVector(p.random(angle), p.random(angle));
  this.acc.mult(this.p.random(0.05, 0.2));
  this.vel.add(this.acc);
  this.vel.mult(0.99);
  this.pos.add(this.vel);
  this.life -= 1;
  this.hueValue = (this.hueValue + 1) % 256;
}

  display() {
    const s = this.p.map(this.life, 255, 0, 1, 20);
    this.p.fill(this.hueValue, 255, 255);
    this.p.ellipse(this.pos.x, this.pos.y, s, s);
  }
}

class System {
  constructor(p, x, y, num) {
    this.p = p;
    this.particles = [];
    this.done = false;
    for (let i = 0; i < num; i++) {
      this.particles.push(new Particle(p, x, y));
    }
  }

  update() {
    this.p.noStroke();
    for (let i = this.particles.length - 1; i >= 0; i--) {
      this.particles[i].update();
      if (this.particles[i].done) this.particles.splice(i, 1);
    }
    this.done = this.particles.length === 0;
  }

  display() {
    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].display();
    }
  }
}

state.ps = state.ps || [];

if (p.random() < 0.3) {
  state.ps.push(new System(p, mouse.x, mouse.y, particleCount));
}

p.background(0);
p.colorMode(p.HSB, 255);

for (let i = state.ps.length - 1; i >= 0; i--) {
  state.ps[i].update();
  state.ps[i].display();
  if (state.ps[i].done) state.ps.splice(i, 1);
}`,
  },
];
