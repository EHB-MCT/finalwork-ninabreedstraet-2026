import styles from "../../pages/Maken/maken.module.scss";

interface Props {
  onExecute: () => void;
  onReset: () => void;
  error: string | null;
  animate: boolean;
  frame: number;
}

export function NEWRunBar({
  onExecute,
  onReset,
  error,
  animate,
  frame,
}: Props) {
  return (
    <>
      <div className={styles.runBar}>
        <button className={styles.btnRun} onClick={onExecute}>
          ▶ uitvoeren
        </button>
        <button className={styles.btnReset} onClick={onReset}>
          ↺ reset
        </button>
        {error ? (
          <span className={styles.statusErr}>fout in code</span>
        ) : (
          <span className={styles.status}>
            {animate ? `frame ${frame}` : "klaar"}
          </span>
        )}
      </div>

      {error && (
        <div className={styles.errorBox}>
          <span className={styles.errorPrefix}>Fout:</span> {error}
        </div>
      )}
    </>
  );
}
