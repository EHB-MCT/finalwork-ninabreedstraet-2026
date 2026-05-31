import { useEffect, useRef } from "react";
import { Pane } from "tweakpane";
import type { Sketch, ParamValues } from "../pages/Maken/sketches";

export function useTweakpane(
  paneContainerRef: React.RefObject<HTMLDivElement>,
  sketch: Sketch,
  params: ParamValues,
  paramsRef: React.MutableRefObject<ParamValues>,
  code: string,
  setParams: (p: ParamValues) => void,
  executeSketch: (
    code: string,
    params: ParamValues,
    resetState?: boolean,
  ) => void,
  setActiveParam: (name: string | null) => void,
  setCodeTab: (tab: "full" | "explained" | "slider") => void,
  sideTab: string,
) {
  const paneRef = useRef<Pane | null>(null);

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
        (pane as any)
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
        (pane as any)
          .addBinding(paneParams, param.name, { label: param.label })
          .on("change", (e: { value: any }) => {
            const next = { ...paramsRef.current, [param.name]: e.value };
            setParams(next);
            if (!sketch.animate) executeSketch(code, next);
          });
      }
      if (param.type === "image") {
        const folder = (pane as any).addFolder({ title: param.label });
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
        (pane as any)
          .addBinding(paneParams, param.name, { label: param.label })
          .on("change", (e: { value: any }) => {
            const next = { ...paramsRef.current, [param.name]: e.value };
            setParams(next);
            if (!sketch.animate) executeSketch(code, next);
          });
      }
    });

    (pane as any).children.forEach((blade: any) => {
      blade.element?.addEventListener("click", () => {
        setActiveParam(blade.key);
        setCodeTab("slider");
      });
    });

    return () => {
      pane.dispose();
      paneRef.current = null;
    };
  }, [sketch.id, sideTab]);
}
