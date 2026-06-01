import { CodeEditor } from "../../components/codeEditor";
import NextButton from "../../components/nextButton";
import { useTranslation } from "react-i18next";
import style from "./oefeningen.module.scss";

export default function Oefening6() {
  const { t } = useTranslation();

  return (
    <div className={style.oefeningBox}>
      <h2>{t("exercises.oefening6.title")}</h2>

      <div
        style={{ padding: "15px", borderRadius: "8px", marginBottom: "20px" }}
      >
        <h3>{t("exercises.common.explanation")}</h3>
        <p>{t("exercises.oefening6.dataStructuresDesc")}</p>
        <ul>
          <li>
            <strong>Array</strong> : {t("exercises.oefening6.arrayDesc")}
          </li>
          <li>
            <strong>Object</strong> : {t("exercises.oefening6.objectDesc")}
          </li>
          <li>
            <strong>Map</strong> : {t("exercises.oefening6.mapDesc")}
          </li>
          <li>
            <strong>Set</strong> : {t("exercises.oefening6.setDesc")}
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
          {`// Object
const persoon = {
  naam: "Anna",
  leeftijd: 25
};
console.log(persoon.naam); // "Anna"

// Array van objecten
const mensen = [
  { naam: "Anna", leeftijd: 25 },
  { naam: "Bob", leeftijd: 30 }
];`}
        </pre>
      </div>

      <div style={{ marginBottom: "40px" }}>
        <h3>{t("exercises.oefening6.exercise1Title")}</h3>
        <p>{t("exercises.oefening6.exercise1Desc")}</p>
        <CodeEditor
          initialCode={`// ${t("exercises.oefening1.placeholder")}

`}
          validation={(code: string | string[]) => {
            if (!code.includes("{")) {
              return {
                message: t("exercises.oefening6.valCurlyBraces"),
              };
            }
            if (!code.includes("Toyota")) {
              return {
                message: t("exercises.oefening6.valToyota"),
              };
            }
            if (!code.includes("2020")) {
              return {
                message: t("exercises.oefening6.val2020"),
              };
            }
            if (
              !code.includes("merk") &&
              !code.includes("brand") &&
              !code.includes("marque")
            ) {
              return {
                message: t("exercises.oefening6.valMerkProperty"),
              };
            }
            return {
              message: t("exercises.oefening6.valSuccess1"),
            };
          }}
        />
      </div>

      <div>
        <h3>{t("exercises.oefening6.exercise2Title")}</h3>
        <p>{t("exercises.oefening6.exercise2Desc")}</p>
        <CodeEditor
          initialCode={`// ${t("exercises.oefening1.placeholder")}

`}
          validation={(code: string | string[]) => {
            if (!code.includes("[")) {
              return {
                message: t("exercises.oefening6.valSquareBrackets"),
              };
            }
            if (!code.includes("Anna")) {
              return {
                message: t("exercises.oefening6.valAnna"),
              };
            }
            if (!code.includes("Bob")) {
              return {
                message: t("exercises.oefening6.valBob"),
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
              message: t("exercises.oefening6.valSuccess2"),
            };
          }}
        />
      </div>

      <NextButton />
    </div>
  );
}
