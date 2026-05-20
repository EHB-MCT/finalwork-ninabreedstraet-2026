import { useState } from "react";
import type { Dispatch, JSX, SetStateAction } from "react";
import type {
  Sketch,
  SketchParam,
  ParamValues,
} from "../../pages/Maken/sketches";
import { SKETCHES } from "../../pages/Maken/sketches";
import styles from "./AccordionPanel.module.scss";

interface AccordionPanelProps {
  activeId: string;
  sketch: Sketch;
  params: ParamValues;
  setParams: Dispatch<SetStateAction<ParamValues>>;
  onSwitchSketch: (id: string) => void;
}

export function AccordionPanel({
  activeId,
  sketch,
  params,
  setParams,
  onSwitchSketch,
}: Readonly<AccordionPanelProps>) {
  const [openParam, setOpenParam] = useState<string | null>(null);

  function toggleParam(name: string): void {
    setOpenParam((prev) => (prev === name ? null : name));
  }

  function handleRangeChange(name: string, value: string): void {
    setParams((prev) => ({ ...prev, [name]: Number.parseFloat(value) }));
  }

  function handleColorChange(name: string, value: string): void {
    setParams((prev) => ({ ...prev, [name]: value }));
  }

  function handleTextChange(name: string, value: string): void {
    setParams((prev) => ({ ...prev, [name]: value }));
  }

  function handleImageChange(name: string, value: string): void {
    setParams((prev) => ({ ...prev, [name]: value }));
  }

  function renderControl(param: SketchParam): JSX.Element {
    const value = params[param.name];

    switch (param.type) {
      case "range":
        return (
          <input
            className={styles.slider}
            type="range"
            min={param.min}
            max={param.max}
            step={param.step}
            value={value as number}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => handleRangeChange(param.name, e.target.value)}
          />
        );
      case "color":
        return (
          <input
            className={styles.colorPicker}
            type="color"
            value={value as string}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => handleColorChange(param.name, e.target.value)}
          />
        );
      case "text":
        return (
          <input
            className={styles.textInput}
            type="text"
            value={value as string}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => handleTextChange(param.name, e.target.value)}
          />
        );
      case "image":
        return (
          <input
            className={styles.textInput}
            type="text"
            placeholder="Afbeeldings-URL..."
            value={value as string}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => handleImageChange(param.name, e.target.value)}
          />
        );
    }
  }

  return (
    <div className={styles.panel}>
      {/* Sketch selector */}
      <div className={styles.sketchSelect}>
        <span className={styles.sketchLabel}>Voorbeelden</span>
        <div className={styles.sketchExplanation}>
          Kies één van de voorbeelden en maak je eigen visuals. Elke parameter
          kan je openklikken om te zien welke code erachter zit en hoe die code
          werkt. Indien je de volledige code wilt zien, kan je op de knop
          onderaan klikken.
        </div>
        <select
          className={styles.dropdown}
          value={activeId}
          onChange={(e) => onSwitchSketch(e.target.value)}
        >
          {SKETCHES.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      {/* Params accordion */}
      <div className={styles.paramList}>
        {sketch.params.map((param: SketchParam) => {
          const isOpen = openParam === param.name;
          const hasDetails = param.explanation || param.codeSnippet;

          return (
            <div
              key={param.name}
              className={`${styles.row} ${isOpen ? styles.rowOpen : ""}`}
            >
              {/* Header: altijd zichtbaar */}
              <div
                className={styles.header}
                onClick={() => hasDetails && toggleParam(param.name)}
                style={{ cursor: hasDetails ? "pointer" : "default" }}
              >
                <span className={styles.arrow}>
                  {hasDetails ? (isOpen ? "▼" : "►") : "·"}
                </span>
                <span className={styles.name}>{param.label}</span>
                <div className={styles.control}>{renderControl(param)}</div>
              </div>

              {/* Body: uitleg + code */}
              {isOpen && hasDetails && (
                <div className={styles.body}>
                  {param.explanation && (
                    <div className={styles.explanation}>
                      {param.explanation}
                    </div>
                  )}
                  {param.codeSnippet && (
                    <pre className={styles.code}>
                      <code>{param.codeSnippet}</code>
                    </pre>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
