import { CodeEditor } from "../../components/codeEditor";
import NextButton from "../../components/nextButton";
import { useTranslation } from "react-i18next";
import style from "./oefeningen.module.scss";

export default function Oefening4() {
  const { t } = useTranslation();

  return (
    <div className={style.oefeningBox}>
      <h2>{t("exercises.oefening4.title")}</h2>

      <div
        style={{ padding: "15px", borderRadius: "8px", marginBottom: "20px" }}
      >
        <h3>{t("exercises.common.explanation")}</h3>
        <p>{t("exercises.oefening4.arrayDesc")}</p>
        <ul>
          <li>
            <strong>{t("exercises.oefening4.create")}</strong> <code>const arr = [1, 2, 3];</code>
          </li>
          <li>
            <strong>{t("exercises.oefening4.index")}</strong>
          </li>
          <li>
            <strong>{t("exercises.oefening4.length")}</strong> <code>arr.length</code>
          </li>
          <li>
            <strong>{t("exercises.oefening4.push")}</strong>
          </li>
          <li>
            <strong>{t("exercises.oefening4.pop")}</strong>
          </li>
          <li>
            <strong>{t("exercises.oefening4.map")}</strong>
          </li>
          <li>
            <strong>{t("exercises.oefening4.filter")}</strong>
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
          {`const fruit = ["appel", "peer", "banaan"];

console.log(fruit[0]); // "appel"
console.log(fruit.length); // 3

fruit.push("kers");
console.log(fruit); // ["appel", "peer", "banaan", "kers"]

const dubbels = fruit.map(f => f + f);
console.log(dubbels); // ["appelappel", "peerpeer", ...]`}
        </pre>
      </div>

      <div style={{ marginBottom: "40px" }}>
        <h3>{t("exercises.oefening4.exercise1Title")}</h3>
        <p>{t("exercises.oefening4.exercise1Desc")}</p>
        <CodeEditor
          initialCode={`// ${t("exercises.oefening1.placeholder")}

`}
          validation={(code) => {
            if (!code.includes("[") || !code.includes("]")) {
              return {
                valid: false,
                message: t("exercises.oefening4.valBrackets"),
              };
            }
            if (
              !code.includes("5") ||
              !code.includes("10") ||
              !code.includes("15")
            ) {
              return {
                valid: false,
                message: t("exercises.oefening4.valValues"),
              };
            }
            if (!code.includes("[0]")) {
              return {
                valid: false,
                message: t("exercises.oefening4.valIndex0"),
              };
            }
            if (!code.includes("console.log")) {
              return {
                valid: false,
                message: t("exercises.oefening4.valConsoleLog"),
              };
            }
            return {
              valid: true,
              message: t("exercises.oefening4.valSuccess1"),
            };
          }}
        />
      </div>

      <div>
        <h3>{t("exercises.oefening4.exercise2Title")}</h3>
        <p>
          {t("exercises.oefening4.exercise2Desc1")} <code>const namen = ["Anna", "Bob"];</code>
          <br />
          {t("exercises.oefening4.exercise2Desc2")}
        </p>
        <CodeEditor
          initialCode={`const namen = ["Anna", "Bob"];

// ${t("exercises.oefening1.placeholder")}

`}
          validation={(code) => {
            if (!code.includes("push")) {
              return { valid: false, message: t("exercises.oefening4.valPush") };
            }
            if (!code.includes("Chris")) {
              return { valid: false, message: t("exercises.oefening4.valChris") };
            }
            if (
              !code.includes("console.log") &&
              !code.includes("console . log")
            ) {
              return {
                valid: false,
                message: t("exercises.oefening4.valConsoleLog"),
              };
            }
            return {
              valid: true,
              message: t("exercises.oefening4.valSuccess2"),
            };
          }}
        />
      </div>

      <NextButton />
    </div>
  );
}
