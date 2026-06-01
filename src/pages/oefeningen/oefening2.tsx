import { CodeEditor } from "../../components/codeEditor";
import NextButton from "../../components/nextButton";
import { useTranslation } from "react-i18next";
import style from "./oefeningen.module.scss";

export default function Oefening2() {
  const { t } = useTranslation();

  return (
    <div className={style.oefeningBox}>
      <h2>{t("exercises.oefening2.title")}</h2>
      <div className={style.uitleg}>
        <h3>{t("exercises.common.explanation")}</h3>
        <p>{t("exercises.oefening2.classIdDesc")}</p>
        <ul>
          <li>{t("exercises.oefening2.classDesc")}</li>
          <li>{t("exercises.oefening2.idDesc")}</li>
        </ul>
        <pre
          style={{
            backgroundColor: "#2d2d2d",
            color: "#fff",
            padding: "10px",
            borderRadius: "5px",
          }}
        >
          {`.container {
  background-color: blue;
}

#header {
  font-size: 24px;
}`}
        </pre>
      </div>

      <div style={{ marginBottom: "40px" }}>
        <h3>{t("exercises.oefening2.exercise1Title")}</h3>
        <p>
          {t("exercises.oefening2.exercise1Desc1")}{" "}
          <code>&lt;div class="knop"&gt;Klik hier&lt;/div&gt;</code>
          <br />
          {t("exercises.oefening2.exercise1Desc2")}
        </p>
        <CodeEditor
          language="css"
          initialCode={`/* ${t("exercises.oefening2.placeholder")} */

`}
          validation={(code: string | string[]) => {
            if (!code.includes(".knop")) {
              return {
                message: t("exercises.oefening2.valClassSelector"),
              };
            }
            if (
              !code.includes("background-color") &&
              !code.includes("background")
            ) {
              return { message: t("exercises.oefening2.valBgColor") };
            }
            if (
              code.includes("red") ||
              code.includes("#ff0000") ||
              code.includes("rgb(255, 0, 0)")
            ) {
              return {
                message: t("exercises.oefening2.valSuccess1"),
              };
            }
            return { message: t("exercises.oefening2.valGood") };
          }}
        />
      </div>

      <div>
        <h3>{t("exercises.oefening2.exercise2Title")}</h3>
        <p>
          {t("exercises.oefening2.exercise2Desc1")}{" "}
          <code>&lt;header id="masthead"&gt;Site Titel&lt;/header&gt;</code>
          <br />
          {t("exercises.oefening2.exercise2Desc2")}
        </p>
        <CodeEditor
          language="css"
          initialCode={`/* ${t("exercises.oefening2.placeholder2")} */

`}
          validation={(code: string | string[]) => {
            if (!code.includes("#masthead")) {
              return {
                message: t("exercises.oefening2.valIdSelector"),
              };
            }
            if (!code.includes("font-size")) {
              return { message: t("exercises.oefening2.valFontSize") };
            }
            if (code.includes("32px") || code.includes("32")) {
              return {
                message: t("exercises.oefening2.valSuccess2"),
              };
            }
            return { message: t("exercises.oefening2.valGood2") };
          }}
        />
      </div>

      <NextButton />
    </div>
  );
}
