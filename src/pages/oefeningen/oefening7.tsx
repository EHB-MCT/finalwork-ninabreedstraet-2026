import { CodeEditor } from "../../components/codeEditor";
import NextButton from "../../components/nextButton";
import { useTranslation } from "react-i18next";
import style from "./oefeningen.module.scss";

export default function Oefening7() {
  const { t } = useTranslation();

  return (
    <div className={style.oefeningBox}>
      <h2>{t("exercises.oefening7.title")}</h2>

      <div
        style={{ padding: "15px", borderRadius: "8px", marginBottom: "20px" }}
      >
        <h3>{t("exercises.common.explanation")}</h3>
        <p>
          {t("exercises.oefening3.introTitle")} <br />
          <br />
          {t("exercises.oefening3.backendThreeThings")} <br /> <br />
          <ol>
            <li>{t("exercises.oefening3.serverDesc")}</li>
            <li>{t("exercises.oefening3.logicDesc")}</li>
            <li>{t("exercises.oefening3.databaseDesc")}</li>
          </ol>
          {t("exercises.oefening3.flowDesc")} <br /> <br />
          {t("exercises.oefening3.consoleLogNote")}
          {t("exercises.oefening3.consoleLogDesc")}
          <br /> <br />
        </p>
        <h3>{t("exercises.oefening3.variableTitle")}</h3>
        <p>{t("exercises.oefening7.variablesDesc")}</p>
        <ul>
          <li>
            <strong>let</strong> : {t("exercises.oefening7.letDesc")}
          </li>
          <li>
            <strong>var</strong> : {t("exercises.oefening7.varDesc")}
          </li>
          <li>
            <strong>const</strong> : {t("exercises.oefening7.constDesc")}
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
          {`let leeftijd = 25;
leeftijd = 26; // toegestaan met let

var naam = "Anna";
var naam = "Bob"; // toegestaan met var

const pi = 3.14;
// pi = 3.15; // NIET toegestaan!`}
        </pre>
      </div>

      <div style={{ marginBottom: "40px" }}>
        <h3>{t("exercises.oefening7.exercise1Title")}</h3>
        <p>{t("exercises.oefening7.exercise1Desc")}</p>
        <CodeEditor
          initialCode={`// ${t("exercises.oefening1.placeholder")}

`}
          validation={(code: string | string[]) => {
            if (!code.includes("let")) {
              return {
                message: t("exercises.oefening7.valUseLet"),
              };
            }
            if (
              !code.includes("temperatuur") &&
              !code.includes("temperature")
            ) {
              return {
                message: t("exercises.oefening7.valTemperatuur"),
              };
            }
            if (!code.includes("20")) {
              return {
                message: t("exercises.oefening7.val20"),
              };
            }
            if (!code.includes("25")) {
              return {
                message: t("exercises.oefening7.val25"),
              };
            }
            return {
              message: t("exercises.oefening7.valSuccess1"),
            };
          }}
        />
      </div>

      <div>
        <h3>{t("exercises.oefening7.exercise2Title")}</h3>
        <p>{t("exercises.oefening7.exercise2Desc")}</p>
        <CodeEditor
          initialCode={`// ${t("exercises.oefening1.placeholder")}

`}
          validation={(code: string | string[]) => {
            if (!code.includes("const")) {
              return {
                message: t("exercises.oefening7.valUseConst"),
              };
            }
            if (!code.includes("maxScore")) {
              return {
                message: t("exercises.oefening7.valMaxScore"),
              };
            }
            if (!code.includes("100")) {
              return {
                message: t("exercises.oefening7.val100"),
              };
            }
            if (
              !code.includes("console.log") &&
              !code.includes("console . log")
            ) {
              return {
                message: t("exercises.oefening4.valConsoleLog"),
              };
            }
            return {
              message: t("exercises.oefening7.valSuccess2"),
            };
          }}
        />
      </div>

      <NextButton />
    </div>
  );
}
