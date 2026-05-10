import { CodeEditor } from "../../components/codeEditor";
import NextButton from "../../components/nextButton";
import style from "./oefeningen.module.scss";

export default function Oefening1() {
  return (
    <div className={style.oefeningBox}>
      <h2>Basis HTML</h2>

      <div
        style={{ padding: "15px", borderRadius: "8px", marginBottom: "20px" }}
      >
        <h3>Uitleg</h3>
        <p>
          HTML (HyperText Markup Language) is de taal voor het bouwen van
          webpagina's.
        </p>
        <ul>
          <li>
            <strong>&lt;html&gt;</strong> - Hoofdelement van elke HTML pagina
          </li>
          <li>
            <strong>&lt;head&gt;</strong> - Bevat meta-informatie (titel,
            styles, scripts)
          </li>
          <li>
            <strong>&lt;body&gt;</strong> - Zichtbare content van de pagina
          </li>
          <li>
            <strong>&lt;h1&gt; t/m &lt;h6&gt;</strong> - Koppen (h1 is
            belangrijkste)
          </li>
          <li>
            <strong>&lt;p&gt;</strong> - Paragraaf/alinea
          </li>
          <li>
            <strong>&lt;div&gt;</strong> - Block-level container
          </li>
          <li>
            <strong>&lt;span&gt;</strong> - Inline container
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
        <h3>Oefening 1: Basis HTML structuur</h3>
        <p>
          Maak een basis HTML pagina met:
          <br />- Een &lt;head&gt; met een &lt;title&gt; "Mijn Eerste Pagina"
          <br />- Een &lt;h1&gt; met tekst "Hallo Wereld"
        </p>
        <CodeEditor
          language="html"
          initialCode={`<!-- Schrijf hier je HTML -->

`}
          validation={(code: string) => {
            if (!code.includes("<html>") && !code.includes("<html")) {
              return { message: "Voeg een html element toe" };
            }
            if (!code.includes("<head>") && !code.includes("<head")) {
              return { message: "Voeg een head element toe" };
            }
            if (!code.includes("<title>") && !code.includes("<title")) {
              return { message: "Voeg een title element toe" };
            }
            if (!code.includes("<body>") && !code.includes("<body")) {
              return { message: "Voeg een body element toe" };
            }
            if (!code.includes("<h1>") && !code.includes("<h1")) {
              return { message: "Voeg een h1 element toe" };
            }
            if (
              !code.toLowerCase().includes("hallowereld") &&
              !code.toLowerCase().includes("hallo wereld") &&
              !code.toLowerCase().includes("h1")
            ) {
              return {
                message: "Voeg de tekst 'Hallo Wereld' toe aan de h1",
              };
            }
            return {
              message: "Goed gedaan! Je basis HTML structuur is compleet.",
            };
          }}
        />
      </div>

      <div>
        <h3>Oefening 2: Meer HTML elementen</h3>
        <p>
          Voeg aan de vorige oefening toe:
          <br />- Een &lt;p&gt; element met tekst "Dit is mijn eerste
          webpagina."
          <br />- Een &lt;span&gt; element binnen de paragraaf met "geweldige"
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
    <!-- Voeg hier je p en span toe -->

  </body>
</html>`}
          validation={(code: string) => {
            if (!code.includes("<p>") && !code.includes("<p ")) {
              return { message: "Voeg een p element toe" };
            }
            if (!code.includes("<span>") && !code.includes("<span ")) {
              return { message: "Voeg een span element toe" };
            }
            if (!code.toLowerCase().includes("eerste webpagina")) {
              return {
                message: "Voeg de tekst 'Dit is mijn eerste webpagina.' toe",
              };
            }
            if (!code.toLowerCase().includes("geweldig")) {
              return {
                message: "Voeg het woord 'geweldige' toe aan de span",
              };
            }
            return {
              message:
                "Goed gedaan! Je hebt alle HTML elementen correct gebruikt.",
            };
          }}
        />
      </div>

      <NextButton />
    </div>
  );
}
