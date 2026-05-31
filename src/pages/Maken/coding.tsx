import styles from "./maken.module.scss";

// elke regel heeft: tekst voor de waarde, de waarde zelf, tekst erna, en een ref-sleutel
function buildLines(state: { layers: any[]; activeLayerId: any }) {
  const activeLayer = state.layers.find((l) => l.id === state.activeLayerId);
  if (!activeLayer || activeLayer.type !== "shapes") return [];

  const s = activeLayer.shapes;
  const t = activeLayer.texture;
  const c = activeLayer.colors;
  const i = activeLayer.interaction;

  return [
    { text: "const state = {" },
    { text: "  shapes: {" },
    {
      text: "    types:  ",
      val: `['${s.types[0]}']`,
      ref: "shapeType",
    },
    { text: "    count:  ", val: s.count, ref: "shapeCount" },
    { text: "    width:  ", val: s.width, ref: "shapeWidth" },
    { text: "    height: ", val: s.height, ref: "shapeHeight" },
    { text: "    round:  ", val: s.round, ref: "shapeRound" },
    { text: "  }," },
    { text: "  texture: {" },
    {
      text: "    mode:       ",
      val: `'${t.mode}'`,
      ref: "textureMode",
    },
    {
      text: "    noiseScale: ",
      val: t.noiseScale,
      ref: "noiseScale",
    },
    {
      text: "    noiseSpeed: ",
      val: t.noiseSpeed,
      ref: "noiseSpeed",
    },
    { text: "  }," },
    { text: "  dithering: {" },
    {
      text: "    enabled:  ",
      val: String(t.dithering.enabled),
      ref: "ditheringEnabled",
    },
    {
      text: "    type:     ",
      val: `'${t.dithering.type}'`,
      ref: "ditheringType",
    },
    {
      text: "    strength: ",
      val: t.dithering.strength,
      ref: "ditheringStrength",
    },
    {
      text: "    scale:    ",
      val: t.dithering.scale,
      ref: "ditheringScale",
    },
    { text: "  }," },
    { text: "  colors: {" },
    { text: "    mode:    ", val: `'${c.mode}'`, ref: "colorMode" },
    {
      text: "    gradientType: ",
      val: `'${c.gradientType || "linear"}'`,
      ref: "gradientType",
    },
    {
      text: "    gradientAngle: ",
      val: c.gradientAngle || 45,
      ref: "gradientAngle",
    },
    {
      text: "    background: ",
      val: `'${c.background || "#0F0F0F"}'`,
      ref: "background",
    },
    {
      text: "    colorA:  ",
      val: `'${c.palette[0]}'`,
      ref: "colorA",
    },
    {
      text: "    colorB:  ",
      val: `'${c.palette[1]}'`,
      ref: "colorB",
    },
    { text: "  }," },
    { text: "  interaction: {" },
    {
      text: "    mode:           ",
      val: `'${i.mode}'`,
      ref: "interactionMode",
    },
    {
      text: "    mouseInfluence: ",
      val: i.mouseInfluence,
      ref: "mouseInfluence",
    },
    { text: "  }," },
    { text: "};" },
    { text: "" },
    { text: "function setup() {", fn: true },
    { text: "  createCanvas(windowWidth, windowHeight);" },
    { text: "}" },
    { text: "" },
    { text: "function draw() {", fn: true },
    { text: "  background(15);" },
    { text: "" },
    {
      text: "  for (let i = 0; i < ",
      val: s.count,
      ref: "shapeCount",
      suffix: "; i++) {",
    },
    { text: "    let x = noise(...) * width;" },
    { text: "    let y = noise(...) * height;" },
    { text: "" },
    {
      text: "    let sz = ",
      val: s.width,
      ref: "shapeWidth",
      suffix: ";",
    },
    {
      text: "    let r  = ",
      val: s.round,
      ref: "shapeRound",
      suffix: " / 100 * sz / 2;",
    },
    { text: "" },
    { text: `    ${s.types[0]}(x, y, sz);`, ref: "shapeType" },
    { text: "  }" },
    { text: "}" },
  ];
}

export default function Coding({ state, activeRef, onHover }) {
  const lines = buildLines(state);

  return (
    <div className={styles.codeWrap}>
      <div className={styles.codeHeader}>
        <span className={styles.codeTitle}>sketch.js</span>
        <button
          className={styles.copyBtn}
          onClick={() => {
            const code = generateCopyCode(state);
            navigator.clipboard.writeText(code);
          }}
        >
          kopieer
        </button>
      </div>

      <div className={styles.codeBody}>
        {lines.map((line, i) => (
          <CodeLine
            key={i}
            line={line}
            activeRef={activeRef}
            onHover={onHover}
          />
        ))}
      </div>
    </div>
  );
}

function CodeLine({ line, activeRef, onHover }) {
  const hasVal = line.val !== undefined;
  const isActive = hasVal && activeRef === line.ref;
  const hasRef = !!line.ref;

  return (
    <div
      className={`${styles.codeLine} ${isActive ? styles.codeLineHighlight : ""}`}
      onMouseEnter={() => hasRef && onHover(line.ref)}
      onMouseLeave={() => hasRef && onHover(null)}
    >
      {/* tekst voor de waarde */}
      <span className={line.fn ? styles.codeFn : styles.codeText}>
        {line.text}
      </span>

      {/* de waarde zelf — gehighlight als activeRef matcht */}
      {hasVal && (
        <span
          className={`${styles.codeVal} ${isActive ? styles.codeValHighlight : ""}`}
        >
          {String(line.val)}
        </span>
      )}

      {/* tekst na de waarde */}
      {line.suffix && <span className={styles.codeText}>{line.suffix}</span>}
    </div>
  );
}

// genereert kopieerbare p5.js code met ingebakken waarden
function generateCopyCode(state: { layers: any[]; activeLayerId: any }) {
  const activeLayer = state.layers.find((l) => l.id === state.activeLayerId);
  if (!activeLayer || activeLayer.type !== "shapes") return "";

  const s = activeLayer.shapes;
  const t = activeLayer.texture;
  const c = activeLayer.colors;

  const useGradient = c.mode === "gradient" && c.gradientType;
  const gradientCode = useGradient
    ? `
  // gradient settings
  const useGradient = true;
  const gradientType = '${c.gradientType || "linear"}';
  const gradientAngle = ${c.gradientAngle || 45};`
    : "";

  return `
// gegenereerd door jouw visual editor

let shapes = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(RGB);
  initShapes();
}

function initShapes() {
  shapes = Array.from({ length: ${s.count} }, () => ({
    x: random(width),
    y: random(height),
    nx: random(1000),
    ny: random(1000),
  }));
}

function draw() {
  background('${c.background || "#0F0F0F"}');

  const colA = color('${c.palette[0]}');
  const colB = color('${c.palette[1]}');${gradientCode}

  for (let i = 0; i < ${s.count}; i++) {
    const sh = shapes[i];${
      t.mode === "noise"
        ? `
    const x = noise(sh.nx * ${t.noiseScale * 0.005}, frameCount * ${t.noiseSpeed * 0.003}) * width;
    const y = noise(sh.ny * ${t.noiseScale * 0.005} + 100, frameCount * ${t.noiseSpeed * 0.003}) * height;`
        : `
    const x = sh.x;
    const y = sh.y;`
    }

    const mix = noise(sh.nx * 0.003, sh.ny * 0.003);
    const col = lerpColor(colA, colB, mix);
    noStroke();

    const w = ${s.width};
    const h = ${s.height};
    const r = ${s.round} / 100 * min(w, h) / 2;

    push();
    translate(x, y);${
      useGradient
        ? `
    if (gradientType === 'radial') {
      const ctx = drawingContext;
      const grd = ctx.createRadialGradient(0, 0, 0, 0, 0, max(w, h) / 2);
      grd.addColorStop(0, colA.toString());
      grd.addColorStop(1, colB.toString());
      ctx.fillStyle = grd;
    } else {
      const angle = (gradientAngle - 90) * PI / 180;
      const diag = sqrt(w * w + h * h) / 2;
      const x1 = -cos(angle) * diag;
      const y1 = -sin(angle) * diag;
      const x2 = cos(angle) * diag;
      const y2 = sin(angle) * diag;
      const ctx = drawingContext;
      const grd = ctx.createLinearGradient(x1, y1, x2, y2);
      grd.addColorStop(0, colA.toString());
      grd.addColorStop(1, colB.toString());
      ctx.fillStyle = grd;
    }`
        : `    fill(col);`
    }${
      s.types[0] === "circle"
        ? `
    ${useGradient ? "drawingContext.beginPath(); drawingContext.ellipse(0, 0, w, h, 0, 0, TWO_PI); drawingContext.fill();" : "ellipse(0, 0, w, h);"}`
        : ""
    }
    ${s.types[0] === "rect" ? `rectMode(CENTER); rect(0, 0, w, h, r);` : ""}
    ${s.types[0] === "triangle" ? `triangle(0, -h/2, w/2, h/2, -w/2, h/2);` : ""}
    ${s.types[0] === "line" ? `stroke(col); strokeWeight(2); line(-w/2, 0, w/2, 0);` : ""}
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
`.trim();
}
