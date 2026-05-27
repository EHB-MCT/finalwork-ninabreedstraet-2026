import { useState, useEffect, useRef, useCallback } from "react";
import style from "./cursorEffect.module.scss";

type EffectType = "none" | "bubbles" | "hearts" | "stars";

// dit is alle informatie van 1 deeltje: de positie (x, y), snelheid (vx, vy), levensduur, hoe snel het verdwijnt, grootte, emoji, hoe het draait, en de draainsnelheid
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  decay: number;
  size: number;
  emoji: string;
  rotation: number;
  spin: number;
}

// dit is alle informatie over één effect, dit is altijd een random waarde
interface EffectConfig {
  icon: string;
  label: string;
  emojis: string[];
  vy: () => number;
  vx: () => number;
  decay: () => number;
  size: () => number;
  spin: boolean;
}
// Record is ingebouwd in Typescript bestaat uit keys en valuetypes
// Dit houdt alle verschillende effecten bij in een array
const EFFECTS: Record<EffectType, EffectConfig> = {
  none: {
    icon: "/",
    label: "Geen",
    emojis: [],
    vy: () => 0,
    vx: () => 0,
    decay: () => 0,
    size: () => 0,
    spin: false,
  },
  bubbles: {
    icon: "🫧",
    label: " ｡𖦹°",
    emojis: [".˚○ • ° ", "🫧⋆｡˚", "  ｡𖦹°‧  "],
    vy: () => -0.6 - Math.random() * 1.2,
    vx: () => (Math.random() - 0.5) * 1.2,
    decay: () => 0.01 + Math.random() * 0.008,
    size: () => 16 + Math.random() * 14,
    spin: false,
  },
  hearts: {
    icon: "🩷",
    label: "♡",
    emojis: ["❤︎⁠", "♡"],
    vy: () => -1.2 - Math.random() * 1.8,
    vx: () => (Math.random() - 0.5) * 2,
    decay: () => 0.014 + Math.random() * 0.012,
    size: () => 14 + Math.random() * 12,
    spin: false,
  },
  stars: {
    icon: "🌟",
    label: "★",
    emojis: ["⋆｡°✩", " ☆", " ★", "✮⋆˙"],
    vy: () => -1 - Math.random() * 2,
    vx: () => (Math.random() - 0.5) * 2.5,
    decay: () => 0.016 + Math.random() * 0.014,
    size: () => 15 + Math.random() * 13,
    spin: true,
  },
};

const EFFECT_KEYS = Object.keys(EFFECTS) as EffectType[];

export function CursorEffectFloater() {
  //huidige states bijhouden van effecttype, of effect ingeschakeld is, of menu open is of niet
  const [active, setActive] = useState<EffectType>("none");
  const [open, setOpen] = useState(false);
  const [enabled, setEnabled] = useState(true);

  // alle noodzakelijke elementen bijhouden zoals het canvas, animatie frame, wellk effect actief is en welk effect ingeschakeld is
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // een lijst van dz actieve deeltjes, een ref zodat het de state niet aanpast
  const particlesRef = useRef<Particle[]>([]);
  const animRef = useRef<number>(0);

  // deze zijn nodig omdat ander de oude waardes worden meegenomen
  const activeRef = useRef<EffectType>(active);
  const enabledRef = useRef(enabled);

  // Als active verandert, wordt de ref geüpdatet en worden alle bestaande deeltjes gewist
  useEffect(() => {
    activeRef.current = active;
    particlesRef.current = [];
  }, [active]);

  // houdt de enableRef in sync met de state
  useEffect(() => {
    enabledRef.current = enabled;
  }, [enabled]);

  // canvas tot hele viewport herhalen
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  // animatie loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const loop = () => {
      // dit wist het canvas elke frame en deeltjes, zodat de levensduur in stand blijft
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particlesRef.current = particlesRef.current.filter((p) => p.life > 0);

      for (const p of particlesRef.current) {
        // doet de locatie + de snelheid, zodat die bewegen
        // vy += 0.04 simuleert de zwaartekracht
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.04;

        // draait het deeltje verder en vermindert zijn levensduur
        p.rotation += p.spin;
        p.life -= p.decay;

        ctx.save();
        // decay instellen, maakt de emoji doorzichtiger tot life tot 0 gaat
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.font = `${p.size}px 'Apple Color Emoji', 'Segoe UI Emoji', sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        // Als het deeltje draait wordt het coördinatensysteem verplaatst naar de positie van het deeltje en roteert het canvas tijdelijk
        // Anders wordt het gewoon op z'n positie getekent
        if (p.spin !== 0) {
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.fillText(p.emoji, 0, 0);
        } else {
          ctx.fillText(p.emoji, p.x, p.y);
        }
        ctx.restore();
      }

      // volgende frame wordt ingesteld
      animRef.current = requestAnimationFrame(loop);
    };

    // nog eens, anders zou de loop na één frame stoppen
    animRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  // mouse tracking
  const lastSpawnRef = useRef(0);

  // wordt maximaal 1 keer per 60 seconden uitgevoerd
  const spawnParticles = useCallback((x: number, y: number) => {
    if (!enabledRef.current) return;
    const now = Date.now();
    if (now - lastSpawnRef.current < 60) return;
    lastSpawnRef.current = now;

    const cfg = EFFECTS[activeRef.current];
    // Voegt 1 nieuw deeltje toe op de muispositie, met random waarden uit de actieve config (effect type)
    particlesRef.current.push({
      x: x + (Math.random() - 0.5) * 8,
      y: y + (Math.random() - 0.5) * 8,
      vx: cfg.vx(),
      vy: cfg.vy(),
      life: 1,
      decay: cfg.decay(),
      size: cfg.size(),
      emoji: cfg.emojis[Math.floor(Math.random() * cfg.emojis.length)],
      rotation: Math.random() * Math.PI * 2,
      spin: cfg.spin ? (Math.random() - 0.5) * 0.15 : 0,
    });
  }, []);

  // muis-tracking
  useEffect(() => {
    const onMove = (e: MouseEvent) => spawnParticles(e.clientX, e.clientY);
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [spawnParticles]);

  const cfg = EFFECTS[active];

  return (
    <>
      {/* Canvas */}
      <canvas ref={canvasRef} className={style.canvas} />

      <div className={style.floater}>
        {/* Dropdown menu */}
        <div className={style.dropdownWrap} onClick={() => setOpen((v) => !v)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M4 0 L4 20 L8 16 L12 24 L14 23 L10 15 L16 15 Z" />
          </svg>
          ▾
          {open && (
            <div className={style.dropdown}>
              {EFFECT_KEYS.map((key) => (
                <button
                  key={key}
                  className={`${style.dropdownItem} ${active === key ? style.dropdownItemActive : ""}`}
                  onClick={() => {
                    setActive(key);
                    setEnabled(true);
                    setOpen(false);
                  }}
                >
                  {EFFECTS[key].label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
