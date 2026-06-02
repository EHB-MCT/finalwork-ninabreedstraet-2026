import { useState, useRef, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { SKETCHES } from "./sketches";
import { useLocalizedSketches } from "../../hooks/useTranslatedSketches";

import type { ParamValues } from "./sketches";
import { useSketch } from "../../hooks/useSketch";
import { useTweakpane } from "../../hooks/useTweakpane";
import { NEWRunBar } from "../../components/panelsComponents/runBar";
import { getDefaultParams } from "./helpers";
import styles from "./maken.module.scss";
import { supabase } from "../../lib/supabaseClient";
import { AccordionPanel } from "../../components/panelsComponents/accordion/accordionPanel";

export default function Maken() {
  const localizedSketches = useLocalizedSketches();

  const [searchParams] = useSearchParams();
  // const initialId = searchParams.get("sketch") ?? SKETCHES[0].id;
  const initialId = searchParams.get("sketch") ?? localizedSketches[0].id;

  const projectParam = searchParams.get("project");

  // Geheugen van het project, onthoudt wat de actieve parameter is die moet worden opgengeklapt bijvoorbeeld
  const [activeId, setActiveId] = useState(initialId);
  const [codeTab, setCodeTab] = useState<"full" | "explained" | "slider">(
    "slider",
  );
  const [activeParam, setActiveParam] = useState<string | null>(null);
  const [params, setParams] = useState<ParamValues>(() => {
    const sketch =
      localizedSketches.find((s) => s.id === initialId) ?? localizedSketches[0];
    return getDefaultParams(sketch);
  });
  const [code, setCode] = useState(() => {
    const sketch =
      localizedSketches.find((s) => s.id === initialId) ?? localizedSketches[0];
    return sketch.code;
  });
  const [error, setError] = useState<string | null>(null);
  const [frame, setFrame] = useState(0);

  const [panelOpen, setPanelOpen] = useState(true);

  // koppelt code aan het actieve canvas.
  const paramsRef = useRef<ParamValues>(params);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const paneContainerRef = useRef<HTMLDivElement>(null);

  const sketch =
    localizedSketches.find((s) => s.id === activeId) ?? localizedSketches[0];

  useEffect(() => {
    paramsRef.current = params;
  }, [params]);

  // project laden, als er vanuit de projects in het account een project wordt geopent, dan laadt deze functie dat project (code, parameters, etc)
  useEffect(() => {
    if (!projectParam) return;
    supabase
      .from("projects")
      .select("*")
      // eq is een filter van supabase, die doet eigenlijk dit in SQL: WHERE id = projectParam
      .eq("id", projectParam)
      .single()
      .then(({ data }: { data: any }) => {
        if (!data) return;
        setActiveId(data.sketch_id);
        setParams(data.params);
        setCode(
          data.code ??
            useLocalizedSketches.find((s) => s.id === data.sketch_id)?.code ??
            "",
        );
      });
  }, [projectParam]);

  // uitvoering op canvas en executeSketch voert het effectief uit, en vangt fouten op.
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

  // elke keer als de code of parameters worden aangepast, wordt het canvas geüpadatet door dit stukje code
  useEffect(() => {
    executeSketch(code, params);
  }, [activeId, code, params, executeSketch]);

  // het canvas initialiseren, zoals je bij p5.js altijd moet doen, daar moet je ook altijd je canvas aanmaken.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }, []);

  // als het een animatie is, verhoogt dit elke 200ms de frameteller waardoor de sketch opnieuw wordt gerendert.
  useEffect(() => {
    if (!sketch.animate) return;
    const id = setInterval(() => setFrame((f) => f + 1), 200);
    return () => clearInterval(id);
  }, [sketch.animate]);

  // dit gaat de UI opbouwen voor de parameters, alle nodige informatie, zoals dus de sketch, parameters, worden hierin meegegeven
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

  // switchSketch wordt opgeroepen als de gebruiker switcht van voorbeeld, dan wordt alles gereset
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

  // dit gaat de huidge state opslaan op het account van de huidige gebruiker.
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

  // dit is wat er wordt uitgevoerd als de gebruiker op de reset knop drukt.
  function handleReset() {
    const newParams = getDefaultParams(sketch);
    setParams(newParams);
    setCode(sketch.code);
    executeSketch(sketch.code, newParams);
  }

  const activeParamData = sketch.params.find((p) => p.name === activeParam);

  return (
    // dit is wat er effectief wordt getoond
    <div className={styles.page}>
      <div className={styles.canvasWrap}>
        <canvas ref={canvasRef} className={styles.canvas} />
      </div>

      <div className={styles.top}>
        <div className={styles.panelZone}>
          <button
            className={styles.panelToggle}
            onClick={() => setPanelOpen((prev) => !prev)}
          >
            {panelOpen ? "Close panel" : "Open panel"}
          </button>
          {panelOpen && (
            <AccordionPanel
              activeId={activeId}
              sketch={sketch}
              params={params}
              setParams={setParams}
              onSwitchSketch={switchSketch}
              code={code}
              onCodeChange={setCode}
              onExecute={executeSketch}
            />
          )}
        </div>
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
