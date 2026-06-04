import { CodeMirrorEditor } from "../../CodeMirrorEditor";
import styles from "./accordionPanel.module.scss";

// dit definieert wat dit component verwacht te ontvangen, zodat die kan functioneren
// void betekent dat de functie niks teruggeeft, voor de rest wordt er verwezen naar de andere types die al gedefinieerd staan in de andere componenten
// de on... functies gaan terug naar de parent als de gebruiker iets aanpast
interface CodeModalProps {
  isOpen: boolean;
  sketchName: string;
  editableCode: string;
  onCodeChange: (code: string) => void;
  onClose: () => void;
  onApply: () => void;
}

export function CodeModal({
  isOpen,
  sketchName,
  editableCode,
  onCodeChange,
  onClose,
  onApply,
}: Readonly<CodeModalProps>) {
  // als het code paneel niet open is, moet die niks teruggeven
  if (!isOpen) return null;

  // stopPropagation zorgt ervoor dat klikken op het paneel zelf het niet sluit
  // aria-label is voor mensen die in een read-only modus zitten
  return (
    <div className={styles.codeModalOverlay} onClick={onClose}>
      <div className={styles.codeModal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.codeModalHeader}>
          <span className={styles.codeModalTitle}>Code — {sketchName}</span>
          <button
            className={styles.codeModalClose}
            onClick={onClose}
            aria-label="Sluiten"
          >
            ✕
          </button>
        </div>

        <CodeMirrorEditor
          value={editableCode}
          onChange={onCodeChange}
          height="400px"
        />

        <div className={styles.codeModalFooter}>
          <button className={styles.codeModalCancel} onClick={onClose}>
            Annuleren
          </button>
          <button className={styles.codeModalApply} onClick={onApply}>
            Toepassen &amp; uitvoeren
          </button>
        </div>
      </div>
    </div>
  );
}
