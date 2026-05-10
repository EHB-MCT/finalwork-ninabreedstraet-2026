import { useState, useRef, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { sketches } from "./sketches";
import type { ParamValues } from "./sketches";
import { useSketch } from "./useSketch";
import styles from "./Maken.module.scss";

function getDefaultParams(sketch: (typeof sketches)[number]): ParamValues {
  return Object.fromEntries(sketch.params.map((p) => [p.name, p.default]));
}

export default function Maken() {
  const [searchParams] = useSearchParams();
  // ?? = als de linkerkant null of undefined is, gebruik dan de rechterkant
  const initialId = searchParams.get("sketch") ?? sketches[0].id;

  // actieve sketch:
  const [activeId, setActiveId] = useState(initialId);

  // actieve tab in de sidebar
  const [sideTab, setSideTab] = useState<"params" | "code" | "info">("params");

  //De huidige parameterwaarde
  const [params, setParams] = useState<ParamValues>(() => {
    const sketch = sketches.find((s) => s.id === initialId) ?? sketches[0];
    return getDefaultParams(sketch);
  });

  //Huidige code van de actieve sketch.
  const [code, setCode] = useState(() => {
    const sketch = sketches.find((s) => s.id === initialId) ?? sketches[0];
    return sketch.code;
  });

  // Eventuele foutmeldingen
  const [error, setError] = useState<string | null>(null);

  // Een teller voor het huidige animatieframe.
  const [frame, setFrame] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const sketch = sketches.find((s) => s.id === activeId) ?? sketches[0];
  const { run, stop } = useSketch(canvasRef, sketch, params);

  // Roept run aan uit de useSketch hook, en als er een fout is wordt die in state gezet zodat hij getoond kan worden.
  const executeSketch = useCallback(
    (currentCode: string, currentParams: ParamValues) => {
      if (!canvasRef.current) return;
      setError(null);
      const err = run(currentCode, currentParams);
      if (err) setError(err.message);
    },
    [run],
  );

  // Elke keer als je van sketch wisselt, wordt de sketch opnieuw uitgevoerd.
  useEffect(() => {
    executeSketch(code, params);
  }, [activeId, code, params, executeSketch]);

  // Als de sketch geanimeerd is, wordt elke 200ms de frame teller verhoogd.
  // Dit is puur om de frame-teller in de UI te updaten (frame 1, frame 2, ...)
  // de echte animatie loopt via requestAnimationFrame in useSketch.
  useEffect(() => {
    if (!sketch.animate) return;
    const id = setInterval(() => setFrame((f) => f + 1), 200);
    return () => clearInterval(id);
  }, [sketch.animate]);

  // Stopt de huidige animatie, en laadt de nieuwe sketch met zijn standaard parameters en code.
  function switchSketch(id: string) {
    stop();
    setError(null);
    setActiveId(id);
    const s = sketches.find((sk) => sk.id === id) ?? sketches[0];
    const newParams = getDefaultParams(s);
    setParams(newParams);
    setCode(s.code);
    setFrame(0);
  }

  // Als je een slider of kleur aanpast, worden de params geüpdatet.
  // Bij een statische sketch wordt hij meteen opnieuw uitgevoerd zodat je de verandering direct ziet.
  // Bij een geanimeerde sketch hoeft dat niet — die loopt al.
  function handleParamChange(name: string, value: number | string) {
    const next = { ...params, [name]: value };
    setParams(next);
    if (!sketch.animate) executeSketch(code, next);
  }

  // Reset alle functies
  function handleReset() {
    const newParams = getDefaultParams(sketch);
    setParams(newParams);
    setCode(sketch.code);
    executeSketch(sketch.code, newParams);
  }

  return (
    <div className={styles.page}>
      {/* Tab bar */}
      <div className={styles.tabBar}>
        <div className={styles.tabs}>
          {sketches.map((s) => (
            <button
              key={s.id}
              className={`${styles.tab} ${s.id === activeId ? styles.tabActive : ""}`}
              onClick={() => switchSketch(s.id)}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>

      {/* Workspace */}
      <div className={styles.workspace}>
        {/* Canvas */}
        <div className={styles.canvasPanel}>
          <div className={styles.canvasWrap}>
            <canvas
              ref={canvasRef}
              className={styles.canvas}
              width={640}
              height={480}
            />
          </div>
        </div>

        {/* Runbar — absoluut onderaan */}
        <div className={styles.runBar}>
          <button
            className={styles.btnRun}
            onClick={() => executeSketch(code, params)}
          >
            ▶ uitvoeren
          </button>
          <button className={styles.btnReset} onClick={handleReset}>
            ↺ reset
          </button>
          {error ? (
            <span className={styles.statusErr}>fout in code</span>
          ) : (
            <span className={styles.status}>
              {sketch.animate ? `frame ${frame}` : "klaar"}
            </span>
          )}
        </div>

        {error && (
          <div className={styles.errorBox}>
            <span className={styles.errorPrefix}>Fout:</span> {error}
          </div>
        )}
      </div>

      {/* Sidebar */}
      <div className={styles.sidebar}>
        <div className={styles.sidebarTabs}>
          {(["params", "code", "info"] as const).map((t) => (
            <button
              key={t}
              className={`${styles.stab} ${sideTab === t ? styles.stabActive : ""}`}
              onClick={() => setSideTab(t)}
            >
              {t === "params" ? "parameters" : t === "code" ? "code" : "uitleg"}
            </button>
          ))}
        </div>

        <div className={styles.sidebarContent}>
          {/* Parameters tab */}
          {sideTab === "params" && (
            <div className={styles.paramPanel}>
              <p className={styles.sectionLabel}>aanpassen</p>
              {sketch.params.map((param) => (
                <div key={param.name} className={styles.paramRow}>
                  <span className={styles.paramName}>{param.label}</span>
                  {param.type === "range" && (
                    <>
                      <input
                        type="range"
                        min={param.min}
                        max={param.max}
                        step={param.step}
                        value={params[param.name] as number}
                        onChange={(e) =>
                          handleParamChange(
                            param.name,
                            Number.parseFloat(e.target.value),
                          )
                        }
                        className={styles.slider}
                      />
                      <span className={styles.paramVal}>
                        {params[param.name] as number}
                      </span>
                    </>
                  )}
                  {param.type === "color" && (
                    <>
                      <input
                        type="color"
                        value={params[param.name] as string}
                        onChange={(e) =>
                          handleParamChange(param.name, e.target.value)
                        }
                        className={styles.colorInput}
                      />
                      <span
                        className={styles.paramVal}
                        style={{ fontSize: 10 }}
                      >
                        {(params[param.name] as string).toUpperCase()}
                      </span>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Code tab */}
          {sideTab === "code" && (
            <div className={styles.codeTab}>
              <textarea
                className={styles.codeEditor}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck={false}
              />
              <p className={styles.codeHint}>
                Bewerk de code en klik uitvoeren ↑
              </p>
            </div>
          )}

          {/* Info tab */}
          {sideTab === "info" && (
            <div className={styles.infoTab}>
              <div className={styles.infoCard}>
                <h3>{sketch.name}</h3>
                <p>{sketch.desc}</p>
              </div>
              <div className={styles.infoCard}>
                <h3>beschikbare variabelen</h3>
                <ul className={styles.varList}>
                  <li>
                    <code>W, H</code> — canvas breedte/hoogte
                  </li>
                  <li>
                    <code>ctx</code> — 2D canvas context
                  </li>
                  <li>
                    <code>t</code> — tijd in frames
                  </li>
                  <li>
                    <code>mouse.x, mouse.y</code> — muispositie
                  </li>
                  <li>
                    <code>state</code> — eigen data opslaan
                  </li>
                  {sketch.params.map((p) => (
                    <li key={p.name}>
                      <code>{p.name}</code> — {p.label}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
