import { CodeEditor } from "../../components/codeEditor";
import { useTranslation } from "react-i18next";
import style from "./oefeningen.module.scss";

export default function Oefening1() {
  const { t } = useTranslation();

  return (
    <div className={style.oefeningBox}>
      <h2>{t("exercises.oefening1.title")}</h2>

      <div
        style={{ padding: "15px", borderRadius: "8px", marginBottom: "20px" }}
      >
        <h3>{t("exercises.common.explanation")}</h3>
        <p>{t("exercises.oefening1.htmlDesc")}</p>
        <ul>
          <li>
            <strong>&lt;html&gt;</strong> : {t("exercises.oefening1.html")}
          </li>
          <li>
            <strong>&lt;head&gt;</strong> : {t("exercises.oefening1.head")}
          </li>
          <li>
            <strong>&lt;body&gt;</strong> : {t("exercises.oefening1.body")}
          </li>
          <li>
            <strong>&lt;h1&gt; t/m &lt;h6&gt;</strong> :{" "}
            {t("exercises.oefening1.headings")}
          </li>
          <li>
            <strong>&lt;p&gt;</strong> : {t("exercises.oefening1.paragraph")}
          </li>
          <li>
            <strong>&lt;div&gt;</strong> : {t("exercises.oefening1.div")}
          </li>
          <li>
            <strong>&lt;span&gt;</strong> : {t("exercises.oefening1.span")}
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
          {`<!DOCTYPE html>
<html>
  <head>
    <title>Mijn Pagina</title>
  </head>
  <body>
    <h1>Mijn Titel</h1>
    <p>Dit is een paragraaf.</p>
  </body>
</html>`}
        </pre>
      </div>

      <div style={{ marginBottom: "40px" }}>
        <h3>{t("exercises.oefening1.exercise1Title")}</h3>
        <p>
          {t("exercises.oefening1.exercise1Desc")}
          <br />- {t("exercises.oefening1.exercise1Req1")}
          <br />- {t("exercises.oefening1.exercise1Req2")}
        </p>
        <CodeEditor
          language="html"
          initialCode={`<!-- ${t("exercises.oefening1.placeholder")} -->

`}
          validation={(code: string) => {
            if (!code.includes("<html>") && !code.includes("<html")) {
              return { message: t("exercises.oefening1.valHtml") };
            }
            if (!code.includes("<head>") && !code.includes("<head")) {
              return { message: t("exercises.oefening1.valHead") };
            }
            if (!code.includes("<title>") && !code.includes("<title")) {
              return { message: t("exercises.oefening1.valTitle") };
            }
            if (!code.includes("<body>") && !code.includes("<body")) {
              return { message: t("exercises.oefening1.valBody") };
            }
            if (!code.includes("<h1>") && !code.includes("<h1")) {
              return { message: t("exercises.oefening1.valH1") };
            }
            if (
              !code.toLowerCase().includes("hallowereld") &&
              !code.toLowerCase().includes("hallo wereld") &&
              !code.toLowerCase().includes("h1")
            ) {
              return {
                message: t("exercises.oefening1.valH1Text"),
              };
            }
            return {
              message: t("exercises.oefening1.valSuccess1"),
            };
          }}
        />
      </div>

      <div>
        <h3>{t("exercises.oefening1.exercise2Title")}</h3>
        <p>
          {t("exercises.oefening1.exercise2Desc")}
          <br />- {t("exercises.oefening1.exercise2Req1")}
          <br />- {t("exercises.oefening1.exercise2Req2")}
        </p>
        <CodeEditor
          language="html"
          initialCode={`<!DOCTYPE html>
<html>
  <head>
    <title>Mijn Eerste Pagina</title>
  </head>
  <body>
    <h1>Hallo Wereld</h1>
    <!-- ${t("exercises.oefening1.placeholder")} -->

  </body>
</html>`}
          validation={(code: string) => {
            if (!code.includes("<p>") && !code.includes("<p ")) {
              return { message: t("exercises.oefening1.valP") };
            }
            if (!code.includes("<span>") && !code.includes("<span ")) {
              return { message: t("exercises.oefening1.valSpan") };
            }
            if (!code.toLowerCase().includes("eerste webpagina")) {
              return {
                message: t("exercises.oefening1.valPText"),
              };
            }
            if (!code.toLowerCase().includes("geweldig")) {
              return {
                message: t("exercises.oefening1.valSpanText"),
              };
            }
            return {
              message: t("exercises.oefening1.valSuccess2"),
            };
          }}
        />
      </div>
    </div>
  );
}
