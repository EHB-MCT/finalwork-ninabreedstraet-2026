import type { RefObject } from "react";
import { SKETCHES } from "../../pages/Maken/sketches";
import styles from "../pages/Maken/maken.module.scss";

interface Props {
  activeId: string;
  paneContainerRef: RefObject<HTMLDivElement>;
  onSwitchSketch: (id: string) => void;
  onSave: () => void;
}

export function NEWLeftPanel({
  activeId,
  paneContainerRef,
  onSwitchSketch,
  onSave,
}: Props) {
  return (
    <div className={styles.leftColumn}>
      <div className={styles.leftPanel}>
        <div className={styles.tabBar}>
          <div className={styles.tabs}>
            {SKETCHES.map((s) => (
              <button
                key={s.id}
                className={`${styles.tab} ${s.id === activeId ? styles.tabActive : ""}`}
                onClick={() => onSwitchSketch(s.id)}
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.sidebarContent}>
          <div className={styles.paramPanel}>
            <p className={styles.sectionLabel}>aanpassen</p>
            <div ref={paneContainerRef} className={styles.tweakpane} />
          </div>
        </div>

        <button onClick={onSave}>opslaan</button>
      </div>
    </div>
  );
}
