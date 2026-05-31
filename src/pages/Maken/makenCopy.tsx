import { useState, useRef, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { Pane } from "tweakpane";
import { SKETCHES } from "./sketches";
import type { ParamValues } from "./sketches";
import { useSketch } from "./useSketch";
import styles from "./maken.module.scss";
import { supabase } from "../../lib/supabaseClient";

function getDefaultParams(sketch: (typeof SKETCHES)[number]): ParamValues {
  return Object.fromEntries(sketch.params.map((p) => [p.name, p.default]));
}

export default function Maken() {
  const [searchParams] = useSearchParams();
  const initialId = searchParams.get("sketch") ?? SKETCHES[0].id;

  const [activeId, setActiveId] = useState(initialId);
  const [sideTab, setSideTab] = useState<"params">("params");
  const [codeTab, setCodeTab] = useState<"full" | "explained" | "slider">(
    "slider",
  );
  const [activeParam, setActiveParam] = useState<string | null>(null);
  const [params, setParams] = useState<ParamValues>(() => {
    const sketch = SKETCHES.find((s) => s.id === initialId) ?? SKETCHES[0];
    return getDefaultParams(sketch);
  });

  const paramsRef = useRef<ParamValues>(params);

  const projectParam = searchParams.get("project");

  useEffect(() => {
    if (!projectParam) return;
    supabase
      .from("projects")
      .select("*")
      .eq("id", projectParam)
      .single()
      .then(({ data }) => {
        if (!data) return;
        setActiveId(data.sketch_id);
        setParams(data.params);
        setCode(
          data.code ??
            SKETCHES.find((s) => s.id === data.sketch_id)?.code ??
            "",
        );
      });
  }, [projectParam]);

  useEffect(() => {
    paramsRef.current = params;
  }, [params]);

  const [code, setCode] = useState(() => {
    const sketch = SKETCHES.find((s) => s.id === initialId) ?? SKETCHES[0];
    return sketch.code;
  });
  const [error, setError] = useState<string | null>(null);
  const [frame, setFrame] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const paneContainerRef = useRef<HTMLDivElement>(null);
  const paneRef = useRef<Pane | null>(null);

  const sketch = SKETCHES.find((s) => s.id === activeId) ?? SKETCHES[0];

  async function handleSave() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("projects").insert({
      user_id: user.id,
      user: user.user_metadata.first_name,
      sketch_id: activeId,
      name: `${sketch.name} - ${new Date().toLocaleDateString()}`,
      params,
      code,
    });
  }

  const { run, stop } = useSketch(canvasRef, sketch, params);

  const executeSketch = useCallback(
    (currentCode: string, currentParams: ParamValues, resetState = true) => {
      if (!canvasRef.current) return;
      setError(null);
      const err = run(currentCode, currentParams, resetState);
      if (err) setError(err.message);
    },
    [run],
  );

  useEffect(() => {
    if (sideTab !== "params" || !paneContainerRef.current) return;
    paneRef.current?.dispose();

    const paneParams = { ...params };
    const pane = new Pane({
      container: paneContainerRef.current,
      expanded: true,
    });
    paneRef.current = pane;

    sketch.params.forEach((param) => {
      if (param.type === "range") {
        pane
          .addBinding(paneParams, param.name, {
            label: param.label,
            min: param.min,
            max: param.max,
            step: param.step,
          })
          .on("change", (e: { value: any }) => {
            const next = { ...paramsRef.current, [param.name]: e.value };
            setParams(next);
            if (!sketch.animate) executeSketch(code, next);
          });
      }
      if (param.type === "color") {
        pane
          .addBinding(paneParams, param.name, { label: param.label })
          .on("change", (e: { value: any }) => {
            const next = { ...paramsRef.current, [param.name]: e.value };
            setParams(next);
            if (!sketch.animate) executeSketch(code, next);
          });
      }
      if (param.type === "image") {
        const folder = pane.addFolder({ title: param.label });
        const wrapper = document.createElement("div");
        wrapper.style.cssText =
          "padding:6px 0;display:flex;flex-direction:column;gap:6px";

        const preview = document.createElement("img");
        Object.assign(preview.style, {
          width: "100%",
          maxHeight: "100px",
          objectFit: "contain",
          borderRadius: "4px",
          background: "#222",
        });
        const currentVal = paneParams[param.name];
        if (typeof currentVal === "string" && currentVal) {
          preview.src = currentVal;
        }
        wrapper.appendChild(preview);

        const label = document.createElement("label");
        Object.assign(label.style, {
          display: "inline-block",
          padding: "6px 12px",
          background: "#333",
          color: "#fff",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "11px",
          textAlign: "center",
        });
        label.textContent = "Kies afbeelding…";

        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = "image/*";
        fileInput.style.display = "none";
        fileInput.addEventListener("change", () => {
          const file = fileInput.files?.[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = (ev) => {
            const dataUrl = ev.target?.result as string;
            preview.src = dataUrl;
            const next = { ...params, [param.name]: dataUrl };
            setParams(next);
            if (!sketch.animate) executeSketch(code, next);
          };
          reader.readAsDataURL(file);
        });

        label.appendChild(fileInput);
        wrapper.appendChild(label);
        folder.element.appendChild(wrapper);
      }
      if (param.type === "text") {
        pane
          .addBinding(paneParams, param.name, { label: param.label })
          .on("change", (e: { value: any }) => {
            const next = { ...paramsRef.current, [param.name]: e.value };
            setParams(next);
            if (!sketch.animate) executeSketch(code, next);
          });
      }
    });

    // Klik op een slider → toon uitleg in code panel
    sketch.params.forEach((param) => {
      const blade = pane.children.find((b: any) => b.key === param.name) as any;
      if (!blade) return;
      blade.element?.addEventListener("click", () => {
        setActiveParam(param.name);
        setCodeTab("slider");
      });
    });

    return () => {
      pane.dispose();
      paneRef.current = null;
    };
  }, [activeId, sideTab]);

  useEffect(() => {
    executeSketch(code, params);
  }, [activeId, code, params, executeSketch]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }, []);

  useEffect(() => {
    if (!sketch.animate) return;
    const id = setInterval(() => setFrame((f) => f + 1), 200);
    return () => clearInterval(id);
  }, [sketch.animate]);

  function switchSketch(id: string) {
    stop();
    setError(null);
    setActiveId(id);
    const s = SKETCHES.find((sk) => sk.id === id) ?? SKETCHES[0];
    setParams(getDefaultParams(s));
    setCode(s.code);
    setFrame(0);
    setActiveParam(null);
    setCodeTab("full");
  }

  function handleReset() {
    const newParams = getDefaultParams(sketch);
    setParams(newParams);
    setCode(sketch.code);
    executeSketch(sketch.code, newParams);
  }

  const activeParamData = sketch.params.find((p) => p.name === activeParam);

  return (
    <div className={styles.page}>
      <div className={styles.canvasWrap}>
        <canvas ref={canvasRef} className={styles.canvas} />
      </div>

      <div className={styles.top}>
        {/* Left panel */}
        <div className={styles.leftColumn}>
          <div className={styles.leftPanel}>
            <div className={styles.tabBar}>
              <div className={styles.tabs}>
                {SKETCHES.map((s) => (
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

            <div className={styles.sidebarContent}>
              {sideTab === "params" && (
                <div className={styles.paramPanel}>
                  <p className={styles.sectionLabel}>aanpassen</p>
                  <div ref={paneContainerRef} className={styles.tweakpane} />
                </div>
              )}

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
            <button onClick={handleSave}>opslaan</button>
          </div>
        </div>
        {/* Right panel: code */}
        <div className={styles.rightColumn}>
          <div className={styles.rightPanel}>
            {/* Code tabs */}
            <div className={styles.codeTabs}>
              {(["slider", "full"] as const).map((t) => (
                <button
                  key={t}
                  className={`${styles.stab} ${codeTab === t ? styles.stabActive : ""}`}
                  onClick={() => setCodeTab(t)}
                >
                  {t === "slider" && "Uitleg per slider"}
                  {t === "full" && "Hele code"}
                </button>
              ))}
            </div>

            {/* Uitleg per slider */}
            {codeTab === "slider" && (
              <div className={styles.sliderExplain}>
                {/* Alle sliders als klikbare lijst */}
                <div className={styles.sliderList}>
                  {sketch.params.map((p) => (
                    <button
                      key={p.name}
                      className={`${styles.tab} ${activeParam === p.name ? styles.tabActive : ""}`}
                      onClick={() => setActiveParam(p.name)}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
                {activeParamData ? (
                  <>
                    <p className={styles.sectionLabel}>bijhorende code</p>
                    <pre className={styles.sliderSnippet}>
                      <code>{activeParamData.codeSnippet}</code>
                    </pre>
                    <p className={styles.sectionLabel}>
                      {activeParamData.label}
                    </p>
                    <p className={styles.sliderExplainText}>
                      {activeParamData.explanation}
                    </p>
                  </>
                ) : (
                  <p className={styles.sliderExplainEmpty}>
                    Klik op een slider in het parameters paneel om de uitleg te
                    zien.
                  </p>
                )}
              </div>
            )}

            <div className={styles.codeTab}>
              {/* Hele code — bewerkbaar */}
              {codeTab === "full" && (
                <>
                  <textarea
                    className={styles.codeEditor}
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    spellCheck={false}
                  />
                  <p className={styles.codeHint}>
                    Bewerk de code en klik uitvoeren ↑
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
        {/* Runbar */}
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
    </div>
  );
}
