import { CodeEditor } from "../../components/codeEditor";
import NextButton from "../../components/nextButton";
import { useTranslation } from "react-i18next";
import style from "./oefeningen.module.scss";

export default function Oefening8() {
  const { t } = useTranslation();

  return (
    <div className={style.oefeningBox}>
      <h2>{t("exercises.oefening8.title")}</h2>

      <div
        style={{ padding: "15px", borderRadius: "8px", marginBottom: "20px" }}
      >
        <h3>{t("exercises.common.explanation")}</h3>
        <p>{t("exercises.oefening8.forLoopDesc")}</p>
        <ul>
          <li>
            <strong>for (let i = start; i &lt; voorwaarde; i++)</strong> :{" "}
            {t("exercises.oefening8.classicFor")}
          </li>
          <li>
            <strong>for (const item of array)</strong> :{" "}
            {t("exercises.oefening8.forOf")}
          </li>
          <li>
            <strong>for (const key in object)</strong> :{" "}
            {t("exercises.oefening8.forIn")}
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
          {`// Klassieke for loop
for (let i = 0; i < 5; i++) {
  console.log(i); // 0, 1, 2, 3, 4
}

// For...of (array)
const fruit = ["appel", "peer", "banaan"];
for (const fr of fruit) {
  console.log(fr);
}`}
        </pre>
      </div>

      <div style={{ marginBottom: "40px" }}>
        <h3>{t("exercises.oefening8.exercise1Title")}</h3>
        <p>{t("exercises.oefening8.exercise1Desc")}</p>
        <CodeEditor
          initialCode={`// ${t("exercises.oefening1.placeholder")}

`}
          validation={(code: string) => {
            if (!code.includes("for")) {
              return { message: t("exercises.oefening8.valUseFor") };
            }
            if (
              !code.includes("let") &&
              !code.includes("var") &&
              !code.includes("const")
            ) {
              return {
                message: t("exercises.oefening8.valDeclareVar"),
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
              message: t("exercises.oefeningen8.valSuccess1"),
            };
          }}
        />
      </div>

      <div>
        <h3>{t("exercises.oefening8.exercise2Title")}</h3>
        <p>
          {t("exercises.oefening8.exercise2Desc1")}{" "}
          <code>const getallen = [10, 20, 30];</code>
          <br />
          <br />
          {t("exercises.oefening8.exercise2Desc2")}
        </p>
        <CodeEditor
          initialCode={`const getallen = [10, 20, 30];

// ${t("exercises.oefening1.placeholder")}

`}
          validation={(code: string) => {
            if (!code.includes("for") && !code.includes("of")) {
              return { message: t("exercises.oefening8.valUseForOf") };
            }
            if (
              !code.includes("getallen") &&
              !code.includes("numbers") &&
              !code.includes("nombres")
            ) {
              return { message: t("exercises.oefening8.valUseGetallen") };
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
              message: t("exercises.oefening8.valSuccess2"),
            };
          }}
        />
      </div>

      <NextButton />
    </div>
  );
}
