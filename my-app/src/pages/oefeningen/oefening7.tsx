import { CodeEditor } from "../../components/codeEditor";
import NextButton from "../../components/nextButton";
import style from "./oefeningen.module.scss";

export default function Oefening7() {
  return (
    <div className={style.oefeningBox}>
      <h2>Variabelen: let, var en const</h2>

      <div
        style={{ padding: "15px", borderRadius: "8px", marginBottom: "20px" }}
      >
        <h3>Uitleg</h3>
        <p>
          In JavaScript zijn er drie manieren om variabelen te declareren:{" "}
          <code>let</code>, <code>var</code> en <code>const</code>.
        </p>
        <ul>
          <li>
            <strong>let:</strong> block-scoped, kan wel herdeclareerd worden
            maar niet in hetzelfde block
          </li>
          <li>
            <strong>var:</strong> function-scoped, kan herbruikt worden
          </li>
          <li>
            <strong>const:</strong> kan niet opnieuw worden toegewezen na
            initialisatie (onveranderlijk)
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
        <h3>Oefening 1: let gebruiken</h3>
        <p>
          Declareer een variabele met <code>let</code> genaamd{" "}
          <code>temperatuur</code> met de waarde 20.
          <br />
          Wijs daarna een nieuwe waarde 25 toe aan dezelfde variabele.
        </p>
        <CodeEditor
          initialCode={`// Declareer temperatuur met let en geef een nieuwe waarde

`}
          validation={(code: string | string[]) => {
            if (!code.includes("let")) {
              return {
                message: "Gebruik let om de variabele te declareren",
              };
            }
            if (!code.includes("temperatuur")) {
              return {
                message: "Gebruik de naam temperatuur",
              };
            }
            if (!code.includes("20")) {
              return {
                message: "Geef eerst de waarde 20",
              };
            }
            if (!code.includes("25")) {
              return {
                message: "Wijs daarna de waarde 25 toe",
              };
            }
            return {
              message:
                "Goed gedaan! Je hebt let correct gebruikt met hertoewijzing.",
            };
          }}
        />
      </div>

      <div>
        <h3>Oefening 2: const gebruiken</h3>
        <p>
          Declareer een constante variabele met <code>const</code> genaamd{" "}
          <code>maxScore</code> met de waarde 100.
          <br />
          Print de constante met <code>console.log</code>.
        </p>
        <CodeEditor
          initialCode={`// Declareer maxScore als const en print het

`}
          validation={(code: string | string[]) => {
            if (!code.includes("const")) {
              return {
                message: "Gebruik const om de variabele te declareren",
              };
            }
            if (!code.includes("maxScore")) {
              return {
                message: "Gebruik de naam maxScore",
              };
            }
            if (!code.includes("100")) {
              return {
                message: "Geef de waarde 100",
              };
            }
            if (
              !code.includes("console.log") &&
              !code.includes("console . log")
            ) {
              return {
                message: "Gebruik console.log om de waarde te printen",
              };
            }
            return {
              message: "Goed gedaan! Je hebt const correct gebruikt.",
            };
          }}
        />
      </div>

      <NextButton />
    </div>
  );
}
