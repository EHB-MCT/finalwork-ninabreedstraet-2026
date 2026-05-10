import { CodeEditor } from "../../components/codeEditor";
import NextButton from "../../components/nextButton";
import style from "./oefeningen.module.scss";

export default function Oefening2() {
  return (
    <div className={style.oefeningBox}>
      <h2>Classes en IDs in CSS</h2>
      <div className={style.uitleg}>
        <h3>Uitleg</h3>
        <p>
          <strong>Classes</strong> en <strong>IDs</strong> zijn manieren om
          HTML-elementen te identificeren en te stylen.
        </p>
        <ul>
          <li>
            <strong>Class</strong> (.naam): Kan meerdere keren gebruikt worden
            op dezelfde pagina. Gebruik een punt (.) voor de klassenaam.
          </li>
          <li>
            <strong>ID</strong> (#naam): Moet uniek zijn op een pagina. Gebruik
            een hashtag (#) voor het ID.
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
          {`.container {
  background-color: blue;
}

#header {
  font-size: 24px;
}`}
        </pre>
      </div>

      <div style={{ marginBottom: "40px" }}>
        <h3>Oefening 1: Class selector</h3>
        <p>
          Er is een HTML element:{" "}
          <code>&lt;div class="knop"&gt;Klik hier&lt;/div&gt;</code>
          <br />
          Schrijf CSS om de class "knop" te stijlen met een rode achtergrond.
        </p>
        <CodeEditor
          language="css"
          initialCode={`/* Schrijf hier je CSS voor de class "knop" */

`}
          validation={(code: string | string[]) => {
            if (!code.includes(".knop")) {
              return {
                message: "Gebruik een class selector met .knop",
              };
            }
            if (
              !code.includes("background-color") &&
              !code.includes("background")
            ) {
              return { message: "Voeg een background-color toe" };
            }
            if (
              code.includes("red") ||
              code.includes("#ff0000") ||
              code.includes("rgb(255, 0, 0)")
            ) {
              return {
                message: "Goed gedaan! Je hebt de class correct gestyled.",
              };
            }
            return { message: "Goed! De class is gestyled." };
          }}
        />
      </div>

      <div>
        <h3>Oefening 2: ID selector</h3>
        <p>
          Er is een HTML element:{" "}
          <code>&lt;header id="masthead"&gt;Site Titel&lt;/header&gt;</code>
          <br />
          Schrijf CSS om het ID "masthead" te stijlen met een lettergrootte van
          32px.
        </p>
        <CodeEditor
          language="css"
          initialCode={`/* Schrijf hier je CSS voor het ID "masthead" */

`}
          validation={(code: string | string[]) => {
            if (!code.includes("#masthead")) {
              return {
                message: "Gebruik een ID selector met #masthead",
              };
            }
            if (!code.includes("font-size")) {
              return { message: "Voeg een font-size toe" };
            }
            if (code.includes("32px") || code.includes("32")) {
              return {
                message: "Goed gedaan! Je hebt het ID correct gestyled.",
              };
            }
            return { message: "Goed! Het ID is gestyled." };
          }}
        />
      </div>

      <NextButton />
    </div>
  );
}
