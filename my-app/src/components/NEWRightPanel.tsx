import type { Sketch, SketchParam } from "../pages/Maken/sketches";
import styles from "../pages/Maken/maken.module.scss";

interface Props {
  codeTab: "full" | "explained" | "slider";
  setCodeTab: (tab: "full" | "explained" | "slider") => void;
  sketch: Sketch;
  activeParam: string | null;
  setActiveParam: (name: string | null) => void;
  code: string;
  setCode: (code: string) => void;
  activeParamData: SketchParam | undefined;
}

export function NEWRightPanel({
  codeTab,
  setCodeTab,
  sketch,
  activeParam,
  setActiveParam,
  code,
  setCode,
  activeParamData,
}: Props) {
  return (
    <div className={styles.rightColumn}>
      <div className={styles.rightPanel}>
        <div className={styles.codeTabs}>
          {(["slider", "full"] as const).map((t) => (
            <button
              key={t}
              className={`${styles.stab} ${codeTab === t ? styles.stabActive : ""}`}
              onClick={() => setCodeTab(t)}
            >
              {t === "slider" && "Uitleg per slider"}
              {t === "full" && "Hele code"}
            </button>
          ))}
        </div>

        {codeTab === "slider" && (
          <div className={styles.sliderExplain}>
            <div className={styles.sliderList}>
              {sketch.params.map((p) => (
                <button
                  key={p.name}
                  className={`${styles.tab} ${activeParam === p.name ? styles.tabActive : ""}`}
                  onClick={() => setActiveParam(p.name)}
                >
                  {p.label}
                </button>
              ))}
            </div>
            {activeParamData ? (
              <>
                <p className={styles.sectionLabel}>bijhorende code</p>
                <pre className={styles.sliderSnippet}>
                  <code>{activeParamData.codeSnippet}</code>
                </pre>
                <p className={styles.sectionLabel}>{activeParamData.label}</p>
                <p className={styles.sliderExplainText}>
                  {activeParamData.explanation}
                </p>
              </>
            ) : (
              <p className={styles.sliderExplainEmpty}>
                Klik op een slider in het parameters paneel om de uitleg te
                zien.
              </p>
            )}
          </div>
        )}

        <div className={styles.codeTab}>
          {codeTab === "full" && (
            <>
              <textarea
                className={styles.codeEditor}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck={false}
              />
              <p className={styles.codeHint}>
                Bewerk de code en klik uitvoeren ↑
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
