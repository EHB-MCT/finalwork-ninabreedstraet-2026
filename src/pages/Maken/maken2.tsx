import {
  useState,
  useRef,
  useEffect,
  useCallback,
  type SetStateAction,
} from "react";
import * as monaco from "monaco-editor";

import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import jsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";
import cssWorker from "monaco-editor/esm/vs/language/css/css.worker?worker";
import htmlWorker from "monaco-editor/esm/vs/language/html/html.worker?worker";
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";
import { SKETCHES } from "./sketches";
import type { Sketch } from "./sketches";

globalThis.MonacoEnvironment = {
  getWorker(_, label) {
    if (label === "json") return new jsonWorker();
    if (label === "css" || label === "scss" || label === "less")
      return new cssWorker();
    if (label === "html" || label === "handlebars" || label === "razor")
      return new htmlWorker();
    if (label === "typescript" || label === "javascript") return new tsWorker();
    return new editorWorker();
  },
};

function getExplanationHeader(explained: string): string {
  const lines = explained.split("\n");
  const firstCode = lines.findIndex(
    (l) => l.trim() !== "" && !l.trim().startsWith("//"),
  );
  return firstCode === -1 ? explained : lines.slice(0, firstCode).join("\n");
}

function MonacoEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const editor = monaco.editor.create(containerRef.current, {
      value,
      language: "javascript",
      theme: "vs-dark",
      minimap: { enabled: false },
      fontSize: 12,
      automaticLayout: true,
      scrollBeyondLastLine: false,
    });
    editor.onDidChangeModelContent(() => onChange(editor.getValue()));
    editorRef.current = editor;
    return () => editor.dispose();
  }, []);

  useEffect(() => {
    const editor = editorRef.current;
    if (editor && value !== editor.getValue()) {
      editor.setValue(value);
    }
  }, [value]);

  return <div ref={containerRef} style={{ flex: 1, minHeight: 0 }} />;
}

function getDefaultParams(sketch: Sketch) {
  return Object.fromEntries(sketch.params.map((p) => [p.name, p.default]));
}

function useSketch(
  canvasRef: unknown,
  sketch: unknown,
  params: { [k: string]: string | number },
) {
  const rafRef = useRef(null);
  const frameRef = useRef(0);
  const mouseRef = useRef({ x: 0, y: 0 });

  const stop = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
  }, []);

  const run = useCallback(
    (
      code: string,
      currentParams: { [s: string]: unknown } | ArrayLike<unknown>,
    ) => {
      stop();
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      const W = canvas.width,
        H = canvas.height;
      const state = {};
      frameRef.current = 0;

      const draw = () => {
        try {
          const fn = new Function(
            "ctx",
            "W",
            "H",
            "t",
            "mouse",
            "state",
            ...Object.keys(currentParams),
            code,
          );
          fn(
            ctx,
            W,
            H,
            frameRef.current,
            mouseRef.current,
            state,
            ...Object.values(currentParams),
          );
        } catch (e) {
          return e;
        }
        if (sketch.animate) {
          frameRef.current++;
          rafRef.current = requestAnimationFrame(draw);
        }
      };

      const err = draw();
      return err || null;
    },
    [stop, canvasRef, sketch],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const move = (e: { clientX: number; clientY: number }) => {
      const r = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    canvas.addEventListener("mousemove", move);
    return () => canvas.removeEventListener("mousemove", move);
  }, [canvasRef]);

  return { run, stop };
}

export default function Maken() {
  const [activeId, setActiveId] = useState(SKETCHES[0].id);
  const [codeMode, setCodeMode] = useState("slider");
  const [selectedParam, setSelectedParam] = useState(null);
  const [params, setParams] = useState(() => getDefaultParams(SKETCHES[0]));
  const [code, setCode] = useState(() => SKETCHES[0].code);
  const [error, setError] = useState(null);
  const [frame, setFrame] = useState(0);

  const canvasRef = useRef(null);
  const sketch = SKETCHES.find((s) => s.id === activeId) ?? SKETCHES[0];
  const { run, stop } = useSketch(canvasRef, sketch, params);

  const executeSketch = useCallback(
    (currentCode, currentParams) => {
      setError(null);
      const err = run(currentCode, currentParams);
      if (err) setError(err.message);
    },
    [run],
  );

  useEffect(() => {
    executeSketch(code, params);
  }, [activeId]);

  useEffect(() => {
    if (!sketch.animate) return;
    const id = setInterval(() => setFrame((f) => f + 1), 200);
    return () => clearInterval(id);
  }, [sketch.animate, activeId]);

  function switchSketch(id: SetStateAction<string>) {
    stop();
    setError(null);
    setActiveId(id);
    setSelectedParam(null);
    const s = SKETCHES.find((sk) => sk.id === id) ?? SKETCHES[0];
    const np = getDefaultParams(s);
    setParams(np);
    setCode(s.code);
    setFrame(0);
    setTimeout(() => executeSketch(s.code, np), 0);
  }

  function handleParamChange(name: string, value: string | number) {
    const next = { ...params, [name]: value };
    setParams(next);
    if (!sketch.animate) executeSketch(code, next);
  }

  function handleParamClick(name) {
    setSelectedParam(name === selectedParam ? null : name);
    if (codeMode !== "slider") setCodeMode("slider");
  }

  const headerText =
    codeMode === "explained" ? getExplanationHeader(sketch.explained) : null;

  const s = {
    root: {
      display: "grid",
      gridTemplateColumns: "260px 1fr 320px",
      height: "100vh",
      background: "var(--color-background-tertiary)",
      fontFamily: "var(--font-mono)",
      overflow: "hidden",
    },
    leftPanel: {
      display: "flex",
      flexDirection: "column",
      background: "var(--color-background-primary)",
      borderRight: "0.5px solid var(--color-border-tertiary)",
      overflow: "hidden",
    },
    panelHeader: {
      padding: "12px 16px 8px",
      fontSize: 10,
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      color: "var(--color-text-tertiary)",
      borderBottom: "0.5px solid var(--color-border-tertiary)",
      fontFamily: "var(--font-sans)",
    },
    sketchList: {
      display: "flex",
      flexDirection: "column",
      gap: 2,
      padding: "8px",
      borderBottom: "0.5px solid var(--color-border-tertiary)",
    },
    sketchBtn: (active: any) => ({
      padding: "7px 10px",
      borderRadius: "var(--border-radius-md)",
      border: "none",
      background: active ? "var(--color-background-info)" : "transparent",
      color: active ? "var(--color-text-info)" : "var(--color-text-secondary)",
      fontSize: 13,
      fontFamily: "var(--font-sans)",
      textAlign: "left",
      cursor: "pointer",
      fontWeight: active ? 500 : 400,
      transition: "background 0.15s",
    }),
    paramsScroll: {
      flex: 1,
      overflow: "auto",
      padding: "12px 16px",
    },
    paramRow: (highlighted: any) => ({
      marginBottom: 16,
      padding: "8px 10px",
      borderRadius: "var(--border-radius-md)",
      background: highlighted ? "var(--color-background-info)" : "transparent",
      border: `0.5px solid ${highlighted ? "var(--color-border-info)" : "transparent"}`,
      cursor: "pointer",
      transition: "background 0.15s",
    }),
    paramLabel: (highlighted: any) => ({
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      fontSize: 12,
      color: highlighted
        ? "var(--color-text-info)"
        : "var(--color-text-secondary)",
      marginBottom: 6,
      fontFamily: "var(--font-sans)",
    }),
    paramVal: {
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      color: "var(--color-text-tertiary)",
    },
    canvasWrap: {
      flex: 1,
      display: "flex",
      alignItems: "stretch",
      justifyContent: "stretch",
      background: "#111",
      position: "relative",
    },
    canvas: {
      width: "100%",
      height: "100%",
      display: "block",
    },
    runBar: {
      position: "absolute",
      bottom: 12,
      left: "50%",
      transform: "translateX(-50%)",
      display: "flex",
      alignItems: "center",
      gap: 8,
      background: "rgba(0,0,0,0.6)",
      backdropFilter: "blur(8px)",
      borderRadius: 99,
      padding: "6px 14px",
      border: "0.5px solid rgba(255,255,255,0.1)",
    },
    runBtn: {
      background: "none",
      border: "none",
      color: "#fff",
      fontSize: 12,
      cursor: "pointer",
      fontFamily: "var(--font-mono)",
      padding: "2px 6px",
      borderRadius: 4,
    },
    statusText: (isErr: any) => ({
      fontSize: 11,
      fontFamily: "var(--font-mono)",
      color: isErr ? "#ff6b6b" : "rgba(255,255,255,0.4)",
    }),
    rightPanel: {
      display: "flex",
      flexDirection: "column",
      background: "#1a1a1a",
      borderLeft: "0.5px solid rgba(255,255,255,0.07)",
      overflow: "hidden",
      height: "100%",
    },
    codeModes: {
      display: "flex",
      borderBottom: "0.5px solid rgba(255,255,255,0.07)",
      flexShrink: 0,
    },
    modeBtn: (active: any) => ({
      flex: 1,
      padding: "9px 4px",
      border: "none",
      background: "none",
      fontSize: 10,
      fontFamily: "var(--font-sans)",
      color: active ? "#fff" : "rgba(255,255,255,0.3)",
      borderBottom: active ? "1.5px solid #4f8ef7" : "1.5px solid transparent",
      cursor: "pointer",
      letterSpacing: "0.03em",
      transition: "color 0.15s",
    }),
    codeArea: {
      flex: 1,
      overflow: "auto",
      padding: "16px",
    },
    codePre: {
      margin: 0,
      fontSize: 12,
      lineHeight: 1.7,
      color: "#c9d1d9",
      fontFamily: "var(--font-mono)",
      whiteSpace: "pre-wrap",
      wordBreak: "break-all",
    },
    codeHint: {
      color: "rgba(255,255,255,0.18)",
      fontFamily: "var(--font-sans)",
      fontSize: 12,
      textAlign: "center",
      padding: "32px 16px",
      lineHeight: 1.6,
    },
    errorBox: {
      position: "absolute",
      bottom: 52,
      left: "50%",
      transform: "translateX(-50%)",
      background: "rgba(220,40,40,0.9)",
      color: "#fff",
      fontSize: 12,
      fontFamily: "var(--font-mono)",
      padding: "6px 14px",
      borderRadius: 8,
      maxWidth: "80%",
    },
  };

  return (
    <div style={s.root}>
      {/* LEFT: sketches + params */}
      <div style={s.leftPanel}>
        <div style={s.panelHeader}>voorbeelden</div>
        <div style={s.sketchList}>
          {SKETCHES.map((sk) => (
            <button
              key={sk.id}
              style={s.sketchBtn(sk.id === activeId)}
              onClick={() => switchSketch(sk.id)}
            >
              {sk.name}
            </button>
          ))}
        </div>

        <div style={s.panelHeader}>parameters</div>
        <div style={s.paramsScroll}>
          {sketch.params.map((param) => (
            <div
              key={param.name}
              style={s.paramRow(selectedParam === param.name)}
              onClick={() => handleParamClick(param.name)}
            >
              <div style={s.paramLabel(selectedParam === param.name)}>
                <span>{param.label}</span>
                {param.type === "range" && (
                  <span style={s.paramVal}>{params[param.name]}</span>
                )}
                {param.type === "color" && (
                  <span style={s.paramVal}>
                    {String(params[param.name]).toUpperCase()}
                  </span>
                )}
              </div>
              {param.type === "range" && (
                <input
                  type="range"
                  min={param.min}
                  max={param.max}
                  step={param.step}
                  value={params[param.name]}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) =>
                    handleParamChange(param.name, parseFloat(e.target.value))
                  }
                  style={{ width: "100%", cursor: "pointer" }}
                />
              )}
              {param.type === "color" && (
                <input
                  type="color"
                  value={params[param.name]}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) =>
                    handleParamChange(param.name, e.target.value)
                  }
                  style={{
                    width: "100%",
                    height: 28,
                    cursor: "pointer",
                    border: "none",
                    background: "none",
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* CENTER: canvas */}
      <div style={s.canvasWrap}>
        <canvas ref={canvasRef} style={s.canvas} width={800} height={600} />
        <div style={s.runBar}>
          <button style={s.runBtn} onClick={() => executeSketch(code, params)}>
            ▶ run
          </button>
          <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 10 }}>
            |
          </span>
          <span style={s.statusText(!!error)}>
            {error ? "fout" : sketch.animate ? `frame ${frame}` : "klaar"}
          </span>
        </div>
        {error && <div style={s.errorBox}>{error}</div>}
      </div>

      {/* RIGHT: code panel */}
      <div
        style={{ ...s.rightPanel, display: "flex", flexDirection: "column" }}
      >
        <div style={s.codeModes}>
          <button
            style={s.modeBtn(codeMode === "slider")}
            onClick={() => setCodeMode("slider")}
          >
            klik op slider
          </button>
          <button
            style={s.modeBtn(codeMode === "full")}
            onClick={() => setCodeMode("full")}
          >
            volledige code
          </button>
          <button
            style={s.modeBtn(codeMode === "explained")}
            onClick={() => setCodeMode("explained")}
          >
            met uitleg
          </button>
        </div>

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            minHeight: 0,
          }}
        >
          {codeMode === "full" && (
            <>
              <MonacoEditor value={code} onChange={setCode} />
              <div
                style={{
                  padding: "10px 16px",
                  borderTop: "0.5px solid rgba(255,255,255,0.07)",
                  display: "flex",
                  gap: 8,
                  alignItems: "center",
                  flexShrink: 0,
                }}
              >
                <button
                  onClick={() => executeSketch(code, params)}
                  style={{
                    background: "#4f8ef7",
                    border: "none",
                    color: "#fff",
                    fontSize: 12,
                    fontFamily: "var(--font-mono)",
                    padding: "5px 14px",
                    borderRadius: 6,
                    cursor: "pointer",
                  }}
                >
                  ▶ uitvoeren
                </button>
                <button
                  onClick={() => {
                    const s2 =
                      SKETCHES.find((sk) => sk.id === activeId) ?? SKETCHES[0];
                    setCode(s2.code);
                  }}
                  style={{
                    background: "none",
                    border: "0.5px solid rgba(255,255,255,0.15)",
                    color: "rgba(255,255,255,0.4)",
                    fontSize: 12,
                    fontFamily: "var(--font-mono)",
                    padding: "5px 14px",
                    borderRadius: 6,
                    cursor: "pointer",
                  }}
                >
                  ↺ reset
                </button>
              </div>
            </>
          )}
          {codeMode === "explained" && (
            <>
              <div
                style={{
                  overflow: "auto",
                  padding: "16px",
                  flexShrink: 0,
                  maxHeight: "40%",
                  borderBottom: "0.5px solid rgba(255,255,255,0.07)",
                }}
              >
                <pre style={s.codePre}>{headerText}</pre>
              </div>
              <MonacoEditor value={code} onChange={setCode} />
              <div
                style={{
                  padding: "10px 16px",
                  borderTop: "0.5px solid rgba(255,255,255,0.07)",
                  display: "flex",
                  gap: 8,
                  alignItems: "center",
                  flexShrink: 0,
                }}
              >
                <button
                  onClick={() => executeSketch(code, params)}
                  style={{
                    background: "#4f8ef7",
                    border: "none",
                    color: "#fff",
                    fontSize: 12,
                    fontFamily: "var(--font-mono)",
                    padding: "5px 14px",
                    borderRadius: 6,
                    cursor: "pointer",
                  }}
                >
                  ▶ uitvoeren
                </button>
                <button
                  onClick={() => {
                    const s2 =
                      SKETCHES.find((sk) => sk.id === activeId) ?? SKETCHES[0];
                    setCode(s2.code);
                  }}
                  style={{
                    background: "none",
                    border: "0.5px solid rgba(255,255,255,0.15)",
                    color: "rgba(255,255,255,0.4)",
                    fontSize: 12,
                    fontFamily: "var(--font-mono)",
                    padding: "5px 14px",
                    borderRadius: 6,
                    cursor: "pointer",
                  }}
                >
                  ↺ reset
                </button>
              </div>
            </>
          )}
          {codeMode === "slider" && !selectedParam && (
            <div style={s.codeArea}>
              <div style={s.codeHint}>
                Klik op een parameter links
                <br />
                om de bijbehorende
                <br />
                code te zien.
              </div>
            </div>
          )}
          {codeMode === "slider" &&
            selectedParam &&
            sketch.paramDocs[selectedParam] && (
              <>
                <div
                  style={{
                    overflow: "auto",
                    padding: "16px",
                    flexShrink: 0,
                    borderBottom: "0.5px solid rgba(255,255,255,0.07)",
                  }}
                >
                  <pre
                    style={s.codePre}
                  >{`// parameter: ${selectedParam}\n// ${sketch.paramDocs[selectedParam]}`}</pre>
                </div>
                <MonacoEditor value={code} onChange={setCode} />
                <div
                  style={{
                    padding: "10px 16px",
                    borderTop: "0.5px solid rgba(255,255,255,0.07)",
                    display: "flex",
                    gap: 8,
                    alignItems: "center",
                    flexShrink: 0,
                  }}
                >
                  <button
                    onClick={() => executeSketch(code, params)}
                    style={{
                      background: "#4f8ef7",
                      border: "none",
                      color: "#fff",
                      fontSize: 12,
                      fontFamily: "var(--font-mono)",
                      padding: "5px 14px",
                      borderRadius: 6,
                      cursor: "pointer",
                    }}
                  >
                    ▶ uitvoeren
                  </button>
                  <button
                    onClick={() => {
                      const s2 =
                        SKETCHES.find((sk) => sk.id === activeId) ??
                        SKETCHES[0];
                      setCode(s2.code);
                    }}
                    style={{
                      background: "none",
                      border: "0.5px solid rgba(255,255,255,0.15)",
                      color: "rgba(255,255,255,0.4)",
                      fontSize: 12,
                      fontFamily: "var(--font-mono)",
                      padding: "5px 14px",
                      borderRadius: 6,
                      cursor: "pointer",
                    }}
                  >
                    ↺ reset
                  </button>
                </div>
              </>
            )}
        </div>
      </div>
    </div>
  );
}
