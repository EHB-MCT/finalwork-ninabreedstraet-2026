import { CodeEditor } from "../../components/codeEditor";
import NextButton from "../../components/nextButton";
import { useTranslation } from "react-i18next";
import style from "./oefeningen.module.scss";

export default function Oefening5() {
  const { t } = useTranslation();

  return (
    <div className={style.oefeningBox}>
      <h2>{t("exercises.oefening5.title")}</h2>

      <div
        style={{ padding: "15px", borderRadius: "8px", marginBottom: "20px" }}
      >
        <h3>{t("exercises.common.explanation")}</h3>
        <p>{t("exercises.oefening5.booleanDesc")}</p>
        <ul>
          <li>
            <strong>true:</strong> {t("exercises.oefening5.trueDesc")}
          </li>
          <li>
            <strong>false:</strong> {t("exercises.oefening5.falseDesc")}
          </li>
          <li>
            <strong> {t("exercises.oefening5.comparisons")}</strong>
          </li>
          <li>
            <strong>===</strong> {t("exercises.oefening5.eq")}
          </li>
          <li>
            <strong>!==</strong> {t("exercises.oefening5.neq")}
          </li>
          <li>
            <strong>&gt;</strong> {t("exercises.oefening5.gt")}
          </li>
          <li>
            <strong>&lt;</strong> {t("exercises.oefening5.lt")}
          </li>
          <li>
            <strong>&gt;=</strong> {t("exercises.oefening5.gte")}
          </li>
          <li>
            <strong>&lt;=</strong> {t("exercises.oefening5.lte")}
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
          {`const isVolwassen = true;
const isKind = false;

console.log(5 > 3);  // true
console.log(5 === 3); // false
console.log(10 >= 10); // true`}
        </pre>
      </div>

      <div style={{ marginBottom: "40px" }}>
        <h3>{t("exercises.oefening5.exercise1Title")}</h3>
        <p>{t("exercises.oefening5.exercise1Desc")}</p>
        <CodeEditor
          initialCode={`// ${t("exercises.oefening1.placeholder")}

`}
          validation={(code: string | string[]) => {
            if (!code.includes("true")) {
              return {
                valid: false,
                message: t("exercises.oefening5.valUseTrue"),
              };
            }
            if (!code.includes("false")) {
              return {
                valid: false,
                message: t("exercises.oefening5.valUseFalse"),
              };
            }
            if (!code.includes("isActief")) {
              return {
                valid: false,
                message: t("exercises.oefening5.valIsActief"),
              };
            }
            if (!code.includes("isUitgeschakeld")) {
              return {
                valid: false,
                message: t("exercises.oefening5.valIsUitgeschakeld"),
              };
            }
            return {
              valid: true,
              message: t("exercises.oefening5.valSuccess1"),
            };
          }}
        />
      </div>

      <div>
        <h3>{t("exercises.oefening5.exercise2Title")}</h3>
        <p>{t("exercises.oefening5.exercise2Desc")}</p>
        <CodeEditor
          initialCode={`// ${t("exercises.oefening1.placeholder")}

`}
          validation={(code: string | string[]) => {
            if (!code.includes(">")) {
              return {
                valid: false,
                message: t("exercises.oefening5.valUseGt"),
              };
            }
            if (!code.includes("15")) {
              return {
                valid: false,
                message: t("exercises.oefening5.valUse15"),
              };
            }
            if (!code.includes("10")) {
              return {
                valid: false,
                message: t("exercises.oefening5.valUse10"),
              };
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
              message: t("exercises.oefening5.valSuccess2"),
            };
          }}
        />
      </div>

      <NextButton />
    </div>
  );
}
