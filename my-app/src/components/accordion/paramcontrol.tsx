import type { JSX } from "react";
import type { SketchParam, ParamValues } from "../../pages/Maken/sketches";
import styles from "./AccordionPanel.module.scss";

// dit definieert wat dit component verwacht te ontvangen, zodat die kan functioneren
// Paramvalues[string] betekent dat dit elke waarde kan hebben dat in Paramvalues zit
// void betekent dat de functie niks teruggeeft, voor de rest wordt er verwezen naar de andere types die al gedefinieerd staan in de andere componenten
// de on... functies gaan terug naar de parent als de gebruiker iets aanpast
interface ParamControlProps {
  param: SketchParam;
  value: ParamValues[string];
  onRangeChange: (name: string, value: string) => void;
  onColorChange: (name: string, value: string) => void;
  onTextChange: (name: string, value: string) => void;
  onImageChange: (name: string, value: string) => void;
}

export function ParamControl({
  param,
  value,
  onRangeChange,
  onColorChange,
  onTextChange,
  onImageChange,
  // readonly zorgt ervoor dat de props onveranderbaar zijn en dat je die niet kunt veranderen.
}: Readonly<ParamControlProps>): JSX.Element {
  // Kijkt naar het type van de parameter en rendert het bijpassende input-element. Elke case geeft een ander input terug
  // stopPropgation zorgt ervoor dat door op de slider te klikken, het panel naar de uilteg en code niet wordt geopent
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
          onChange={(e) => onRangeChange(param.name, e.target.value)}
        />
      );
    case "color":
      return (
        <input
          className={styles.colorPicker}
          type="color"
          value={value as string}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => onColorChange(param.name, e.target.value)}
        />
      );
    case "text":
      return (
        <input
          className={styles.textInput}
          type="text"
          value={value as string}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => onTextChange(param.name, e.target.value)}
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
          onChange={(e) => onImageChange(param.name, e.target.value)}
        />
      );
  }
}
