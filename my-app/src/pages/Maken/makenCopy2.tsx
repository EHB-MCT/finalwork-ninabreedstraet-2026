import { useState, useRef, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { SKETCHES } from "./sketches";
import type { ParamValues } from "./sketches";
import { useSketch } from "./useSketch";
import { useTweakpane } from "../../hooks/useTweakpane";
import { NEWLeftPanel } from "../../components/NEWLeftPanel";
import { NEWRightPanel } from "../../components/NEWRightPanel";
import { NEWRunBar } from "../../components/NEWRunBar";
import { getDefaultParams } from "./NEWhelpers";
import styles from "./maken.module.scss";
import { supabase } from "../../lib/supabaseClient";

export default function Maken() {
  const [searchParams] = useSearchParams();
  const initialId = searchParams.get("sketch") ?? SKETCHES[0].id;
  const projectParam = searchParams.get("project");

  const [activeId, setActiveId] = useState(initialId);
  const [codeTab, setCodeTab] = useState<"full" | "explained" | "slider">(
    "slider",
  );
  const [activeParam, setActiveParam] = useState<string | null>(null);
  const [params, setParams] = useState<ParamValues>(() => {
    const sketch = SKETCHES.find((s) => s.id === initialId) ?? SKETCHES[0];
    return getDefaultParams(sketch);
  });
  const [code, setCode] = useState(() => {
    const sketch = SKETCHES.find((s) => s.id === initialId) ?? SKETCHES[0];
    return sketch.code;
  });
  const [error, setError] = useState<string | null>(null);
  const [frame, setFrame] = useState(0);

  const paramsRef = useRef<ParamValues>(params);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const paneContainerRef = useRef<HTMLDivElement>(null);

  const sketch = SKETCHES.find((s) => s.id === activeId) ?? SKETCHES[0];

  useEffect(() => {
    paramsRef.current = params;
  }, [params]);

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

  useTweakpane(
    paneContainerRef,
    sketch,
    params,
    paramsRef,
    code,
    setParams,
    executeSketch,
    setActiveParam,
    setCodeTab,
    "params",
  );

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
        <NEWLeftPanel
          activeId={activeId}
          paneContainerRef={paneContainerRef}
          onSwitchSketch={switchSketch}
          onSave={handleSave}
        />

        <NEWRightPanel
          codeTab={codeTab}
          setCodeTab={setCodeTab}
          sketch={sketch}
          activeParam={activeParam}
          setActiveParam={setActiveParam}
          code={code}
          setCode={setCode}
          activeParamData={activeParamData}
        />

        <NEWRunBar
          onExecute={() => executeSketch(code, params)}
          onReset={handleReset}
          error={error}
          animate={sketch.animate}
          frame={frame}
        />
      </div>
    </div>
  );
}
