import type { JSX } from "react";
import type {
  SketchParam,
  ParamValues,
} from "../../../pages/Maken/sketches.tsx";
import { ParamControl } from "./paramcontrol.tsx";
import styles from "./AccordionPanel.module.scss";
import { useTranslation } from "react-i18next";

// dit definieert wat dit component verwacht te ontvangen, zodat die kan functioneren
// void betekent dat de functie niks teruggeeft, voor de rest wordt er verwezen naar de andere types die al gedefinieerd staan in de andere componenten
interface AccordionRowProps {
  param: SketchParam;
  params: ParamValues;
  isOpen: boolean;
  onToggle: (name: string) => void;
  onRangeChange: (name: string, value: string) => void;
  onColorChange: (name: string, value: string) => void;
  onTextChange: (name: string, value: string) => void;
  onImageChange: (name: string, value: string) => void;
}

export function AccordionRow({
  param,
  params,
  isOpen,
  onToggle,
  onRangeChange,
  onColorChange,
  onTextChange,
  onImageChange,
  // readonly zorgt ervoor dat de props onveranderbaar zijn en dat je die niet kunt veranderen.
}: Readonly<AccordionRowProps>): JSX.Element {
  // dit haalt de huidige waarde op van die specifieke parameter
  const value = params[param.name];
  const { t } = useTranslation();

  // dit kijt of er een uitleg of code snippet is, zo ja, dan kan die uitklappen, zo nee, dan niet
  const hasDetails = param.explanation || param.codeSnippet;

  return (
    <div
      key={param.name}
      className={`${styles.row} ${isOpen ? styles.rowOpen : ""}`}
    >
      {/* Header: altijd zichtbaar */}
      <div
        // dus als er een uitleg en naam is van de parameter, dan wordt die klikbaar
        // als die details heeft is de cursor een pointer, anders is het gewoon de default instelling
        className={styles.header}
        onClick={() => hasDetails && onToggle(param.name)}
        style={{ cursor: hasDetails ? "pointer" : "default" }}
      >
        {/* toont een pijltje naar beneden als het open is, anders het andere pijltje, als het geen details heeft, toont het een puntje */}
        <span className={styles.arrow}>
          {hasDetails ? (isOpen ? "▼" : "►") : "·"}
        </span>
        <span className={styles.name}>{param.label}</span>
        <div className={styles.control}>
          {/* checkt welke parameter-type er nodig is en toont die, dit is een apart component */}
          <ParamControl
            param={param}
            value={value}
            onRangeChange={onRangeChange}
            onColorChange={onColorChange}
            onTextChange={onTextChange}
            onImageChange={onImageChange}
          />
        </div>
      </div>

      {/* Body: uitleg + code: alleen zichtbaar als die open is en details heeft */}
      {isOpen && hasDetails && (
        <div className={styles.body}>
          <span className={styles.sketchLabel}>1. Code</span>
          {param.codeSnippet && (
            <pre className={styles.code}>
              <code>{param.codeSnippet}</code>
            </pre>
          )}
          <span className={styles.sketchLabel}>2. {t("maken.uitleg")}</span>

          {param.explanation && (
            <div className={styles.explanation}>
              {typeof param.explanation === "string" ? (
                <span dangerouslySetInnerHTML={{ __html: param.explanation }} />
              ) : (
                param.explanation
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
