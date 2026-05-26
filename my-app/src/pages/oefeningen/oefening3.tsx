import { useState, useRef, useEffect } from "react";
import * as monaco from "monaco-editor";
import { useTranslation } from "react-i18next";
import style from "./oefeningen.module.scss";
import NextButton from "../../components/nextButton";

const initialCode = `let leeftijd = 20;

// Schrijf een if statement dat controleert
// of iemand volwassen is (leeftijd >= 18)
// en toon "Volwassen" of "Niet volwassen"

`;

const solutionCode = `let leeftijd = 20;

if (leeftijd >= 18) {
  console.log("Volwassen");
} else {
  console.log("Niet volwassen");
}`;

const btnStyle = {
  padding: "8px 16px",
  cursor: "pointer",
  backgroundColor: "#007bff",
  color: "white",
  border: "none",
  borderRadius: "4px",
};

function Oefening3() {
  const { t } = useTranslation();
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    if (!containerRef.current) return;

    const editor = monaco.editor.create(containerRef.current, {
      value: initialCode,
      language: "javascript",
      theme: "vs-dark",
      minimap: { enabled: false },
      fontSize: 14,
      automaticLayout: true,
    });

    editorRef.current = editor;

    return () => editor.dispose();
  }, []);

  function runCode() {
    const code = editorRef.current?.getValue() || "";
    setFeedback("");

    try {
      const originalLog = console.log;
      const logs: string[] = [];

      console.log = (...args) => {
        logs.push(args.join(" "));
      };

      eval(code);

      console.log = originalLog;

      const result = logs.join("\n");

      if (code.includes("if") && code.includes(">=")) {
        if (result.includes("Volwassen") || result.includes("Niet volwassen") || result.includes("Adult") || result.includes("volwassen")) {
          setFeedback(t("exercises.oefening3.valSuccess"));
        } else {
          setFeedback(t("exercises.common.useConsoleLog"));
        }
      } else {
        setFeedback(t("exercises.oefening3.valUseIf"));
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setFeedback(`${t("exercises.common.error")} ${errorMessage}`);
    }
  }

  function showAnswer() {
    editorRef.current?.setValue(solutionCode);
  }

  function resetCode() {
    setFeedback("");
    editorRef.current?.setValue(initialCode);
  }

  return (
    <div className={style.oefeningBox}>
      <h2>{t("exercises.oefening3.title")}</h2>

      <div
        style={{ padding: "15px", borderRadius: "8px", marginBottom: "20px" }}
      >
        <h3>{t("exercises.common.explanation")}</h3>
        <p>
          {t("exercises.oefening3.introTitle")} <br /> <br />
          {t("exercises.oefening3.restaurantAnalogy")}
          <br /> <br />
          {t("exercises.oefening3.frontendDesc")} <br /> <br />
          {t("exercises.oefening3.backendDesc")}
          <br />
          <br />
          {t("exercises.oefening3.backendThreeThings")} <br /> <br />
          {t("exercises.oefening3.serverDesc")} <br /> <br />
          {t("exercises.oefening3.logicDesc")} <br /> <br />
          {t("exercises.oefening3.databaseDesc")} <br /> <br />
          {t("exercises.oefening3.flowDesc")} <br /> <br />
          {t("exercises.oefening3.upcomingExercises")} <br /> <br />
          {t("exercises.oefening3.ifIntro")}
          <br /> <br />
          {t("exercises.oefening3.consoleLogNote")} <br /> <br />
          {t("exercises.oefening3.consoleLogDesc")}
          <br /> <br />
        </p>
        <p>{t("exercises.oefening3.ifStatementDesc")}</p>
        <ul>
          <li key="if">
            <strong>if (voorwaarde)</strong> - {t("exercises.oefening3.ifKeyword")}
          </li>
          <li key="else">
            <strong>else</strong> - {t("exercises.oefening3.elseKeyword")}
          </li>
          <li key="gt">
            <strong>&gt;</strong> - {t("exercises.oefening3.gt")}
          </li>
          <li key="gte">
            <strong>&gt;=</strong> - {t("exercises.oefening3.gte")}
          </li>
          <li key="lt">
            <strong>&lt;</strong> - {t("exercises.oefening3.lt")}
          </li>
          <li key="lte">
            <strong>&lt;=</strong> - {t("exercises.oefening3.lte")}
          </li>
          <li key="eq">
            <strong>===</strong> - {t("exercises.oefening3.eq")}
          </li>
          <li key="neq">
            <strong>!==</strong> - {t("exercises.oefening3.neq")}
          </li>
        </ul>
        <pre
          style={{
            backgroundColor: "#2d2d2d",
            color: "#fff",
            padding: "10px",
            borderRadius: "5px",
          }}
        >
          {`let leeftijd = 20;

if (leeftijd >= 18) {
  console.log("Volwassen");
} else {
  console.log("Niet volwassen");
}`}
        </pre>
      </div>

      <p>
        <strong>Opgave:</strong> {t("exercises.oefening3.assignment")}
      </p>

      <ul>
        <li key="var">
          {t("exercises.oefening3.varDefined")}
        </li>
        <li key="check">
          {t("exercises.oefening3.checkAge")}
        </li>
        <li key="show">
          {t("exercises.oefening3.showResult")}
        </li>
      </ul>

      <div
        ref={containerRef}
        style={{
          height: "300px",
          border: "1px solid #ccc",
          marginBottom: "15px",
        }}
      />

      <div style={{ display: "flex", gap: "10px" }}>
        <button onClick={runCode} style={btnStyle}>
          {t("exercises.common.runCode")}
        </button>
        <button onClick={resetCode} style={btnStyle}>
          {t("exercises.common.reset")}
        </button>
        <button onClick={showAnswer} style={btnStyle}>
          {t("exercises.common.showSolution")}
        </button>
      </div>

      {feedback && (
        <div
          style={{
            marginTop: "15px",
            padding: "10px",
            backgroundColor: feedback.includes("Goed") || feedback.includes("Well") || feedback.includes("Bien") ? "#d4edda" : "#f8d7da",
            borderRadius: "5px",
          }}
        >
          {feedback}
        </div>
      )}

      <NextButton />
    </div>
  );
}

export default Oefening3;
