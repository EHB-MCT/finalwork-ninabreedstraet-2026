import { useState } from "react";
import type { SketchParam } from "../../../pages/Maken/sketches";
import { SKETCHES } from "../../../pages/Maken/sketches";
import { useAccordionParams } from "../../../hooks/useaccordionparams";
import { AccordionRow } from "./accordionRow";
import { CodeModal } from "./codeModal";
import { saveProject } from "./projectService";
import styles from "./AccordionPanel.module.scss";
import type { AccordionPanelProps } from "./types";
import { useTranslation } from "react-i18next";

export function AccordionPanel({
  activeId,
  sketch,
  params,
  setParams,
  onSwitchSketch,
  code,
  onCodeChange,
  onExecute,
  // readonly zorgt ervoor dat de props onveranderbaar zijn en dat je die niet kunt veranderen.
}: Readonly<AccordionPanelProps>) {
  // houdt de huidige staat bij van de code
  const [codeModalOpen, setCodeModalOpen] = useState(false);
  const [editableCode, setEditableCode] = useState("");
  const [projectName, setProjectName] = useState("");

  const { t } = useTranslation();

  // alle logica van een aparte hook halen, zo blijft dit bestand overzichtelijk
  const {
    openParam,
    toggleParam,
    handleRangeChange,
    handleColorChange,
    handleTextChange,
    handleImageChange,
  } = useAccordionParams(setParams);

  // dit kopieert de huidige code en zet die om naar bewerkbare code
  async function showCode() {
    setEditableCode(code);
    setCodeModalOpen(true);
  }

  // stuurt de aangepaste code door naar editableCode, voert de code/sketch uit en sluit het code-panel
  function handleModalApply() {
    onCodeChange(editableCode);
    onExecute(editableCode, params);
    setCodeModalOpen(false);
  }

  // sluit het code paneel zonder iets op te slaan
  function handleModalClose() {
    setCodeModalOpen(false);
  }

  // slaat het project op, op het account
  async function handleSave() {
    await saveProject(activeId, sketch, params, code, projectName);
  }

  return (
    <div className={styles.panel}>
      {/* Sketch selector */}
      <div className={styles.sketchSelect}>
        <div className={styles.sketchExplanation}>
          {t("maken.werken")}

          <ol>
            <li> {t("maken.een")}</li>
            <li>{t("maken.twee")}</li>
            <li>{t("maken.drie")}</li>
            <li>{t("maken.vier")}</li>
          </ol>
        </div>
        {/* Dropdown menu waarmee je tussen de sketches kan kiezen: */}
        {/* <select
          className={styles.dropdown}
          value={activeId}
          onChange={(e) => onSwitchSketch(e.target.value)}
        >
          {SKETCHES.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select> */}
        <span className={styles.sketchLabel}>{t("maken.voorbeelden")}</span>
        <div className={styles.sketchScrollWrapper}>
          {/* ipv een dropdown-menu een horizontaal menu met previewbeelden, 
          die beelden zitten ook in de database en hier wordt erover gemapt.
          Dezelfde functie onSwitchSketch wordt gebruikt om van skecth te switchen, maakt gebruik van de id 
          die functie wordt aangeroepen in de Maken pagina. De rest is css
          */}
          {SKETCHES.map((s) => (
            <button
              key={s.id}
              className={`${styles.sketchCard} ${activeId === s.id ? styles.sketchCardActive : ""}`}
              onClick={() => onSwitchSketch(s.id)}
            >
              <div className={styles.sketchThumb}>
                {s.previewImage ? (
                  <img src={s.previewImage} alt={s.name} />
                ) : (
                  <span className={styles.sketchThumbPlaceholder} />
                )}
              </div>
              <span className={styles.sketchCardName}>{s.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Params accordion */}
      <div className={styles.paramList}>
        {/* rendert elke parameter als een aparte rij, dit zit ook in een apart componetent zodat de code ordelijk blijft */}
        {sketch.params.map((param: SketchParam) => (
          <AccordionRow
            key={param.name}
            param={param}
            params={params}
            isOpen={openParam === param.name}
            onToggle={toggleParam}
            onRangeChange={handleRangeChange}
            onColorChange={handleColorChange}
            onTextChange={handleTextChange}
            onImageChange={handleImageChange}
          />
        ))}
      </div>

      <div className={styles.buttons}>
        <input
          className={styles.projectNameInput}
          type="text"
          placeholder="Geef je visual een naam..."
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
        />
        <button onClick={handleSave} disabled={!projectName.trim()}>
          {t("maken.opslaan")}
        </button>
        <button onClick={showCode}>{t("maken.code")}</button>
      </div>

      <CodeModal
        isOpen={codeModalOpen}
        sketchName={sketch.name}
        editableCode={editableCode}
        onCodeChange={setEditableCode}
        onClose={handleModalClose}
        onApply={handleModalApply}
      />
    </div>
  );
}
