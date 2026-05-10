import { CodeEditor } from "../../components/codeEditor";
import NextButton from "../../components/nextButton";
import style from "./oefeningen.module.scss";

export default function Oefening5() {
  return (
    <div className={style.oefeningBox}>
      <h2>Boolean: true / false</h2>

      <div
        style={{ padding: "15px", borderRadius: "8px", marginBottom: "20px" }}
      >
        <h3>Uitleg</h3>
        <p>
          Een <strong>boolean</strong> is een data type dat alleen twee waarden
          kan hebben: <code>true</code> (waar) of <code>false</code> (onwaar).
        </p>
        <ul>
          <li>
            <strong>true:</strong> iets dat waar is
          </li>
          <li>
            <strong>false:</strong> iets dat onwaar is
          </li>
          <li>
            <strong> Vergelijkingen:</strong> leveren een boolean op
          </li>
          <li>
            <strong>===</strong> is gelijk aan
          </li>
          <li>
            <strong>!==</strong> is niet gelijk aan
          </li>
          <li>
            <strong>&gt;</strong> groter dan
          </li>
          <li>
            <strong>&lt;</strong> kleiner dan
          </li>
          <li>
            <strong>&gt;=</strong> groter of gelijk aan
          </li>
          <li>
            <strong>&lt;=</strong> kleiner of gelijk aan
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
        <h3>Oefening 1: Boolean waarden</h3>
        <p>
          Maak een variabele <code>isActief</code> met de waarde{" "}
          <code>true</code>.
          <br />
          Maak een variabele <code>isUitgeschakeld</code> met de waarde{" "}
          <code>false</code>.
        </p>
        <CodeEditor
          initialCode={`// Maak hier de twee boolean variabelen

`}
          validation={(code: string | string[]) => {
            if (!code.includes("true")) {
              return {
                valid: false,
                message: "Gebruik de waarde true",
              };
            }
            if (!code.includes("false")) {
              return {
                valid: false,
                message: "Gebruik de waarde false",
              };
            }
            if (!code.includes("isActief")) {
              return {
                valid: false,
                message: "Maak een variabele met de naam isActief",
              };
            }
            if (!code.includes("isUitgeschakeld")) {
              return {
                valid: false,
                message: "Maak een variabele met de naam isUitgeschakeld",
              };
            }
            return {
              valid: true,
              message:
                "Goed gedaan! Je hebt beide boolean variabelen correct aangemaakt.",
            };
          }}
        />
      </div>

      <div>
        <h3>Oefening 2: Vergelijkingen</h3>
        <p>
          Controleer of 15 groter is dan 10 en print het resultaat.
          <br />
          Gebruik een vergelijking met <code>&gt;</code>.
        </p>
        <CodeEditor
          initialCode={`// Vergelijk 15 en 10 en het resultaat

`}
          validation={(code: string | string[]) => {
            if (!code.includes(">")) {
              return {
                valid: false,
                message: "Gebruik de > operator om te vergelijken",
              };
            }
            if (!code.includes("15")) {
              return {
                valid: false,
                message: "Gebruik het getal 15",
              };
            }
            if (!code.includes("10")) {
              return {
                valid: false,
                message: "Gebruik het getal 10",
              };
            }
            if (
              !code.includes("console.log") &&
              !code.includes("console . log")
            ) {
              return {
                valid: false,
                message: "Gebruik console.log om het resultaat te printen",
              };
            }
            return {
              valid: true,
              message:
                "Goed gedaan! Je hebt de vergelijking correct uitgevoerd.",
            };
          }}
        />
      </div>

      <NextButton />
    </div>
  );
}
