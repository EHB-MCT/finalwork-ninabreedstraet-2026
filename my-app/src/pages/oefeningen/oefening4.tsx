import { CodeEditor } from "../../components/codeEditor";
import NextButton from "../../components/nextButton";
import style from "./oefeningen.module.scss";

export default function Oefening4() {
  return (
    <div className={style.oefeningBox}>
      <h2>Arrays</h2>

      <div
        style={{ padding: "15px", borderRadius: "8px", marginBottom: "20px" }}
      >
        <h3>Uitleg</h3>
        <p>
          Een <strong>array</strong> is een lijst van waarden die je kunt
          opslaan en benaderen via een index.
        </p>
        <ul>
          <li>
            <strong>Aanmaken:</strong> <code>const arr = [1, 2, 3];</code>
          </li>
          <li>
            <strong>Index:</strong> Arrays starten bij 0 (eerste element is
            index 0)
          </li>
          <li>
            <strong>length:</strong> <code>arr.length</code> geeft het aantal
            elementen
          </li>
          <li>
            <strong>push():</strong> Voeg element toe aan het einde
          </li>
          <li>
            <strong>pop():</strong> Verwijder laatste element
          </li>
          <li>
            <strong>map():</strong> Transformeer elk element
          </li>
          <li>
            <strong>filter():</strong> Filter elementen op voorwaarde
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
          {`const fruit = ["appel", "peer", "banaan"];

console.log(fruit[0]); // "appel"
console.log(fruit.length); // 3

fruit.push("kers");
console.log(fruit); // ["appel", "peer", "banaan", "kers"]

const dubbels = fruit.map(f => f + f);
console.log(dubbels); // ["appelappel", "peerpeer", ...]`}
        </pre>
      </div>

      <div style={{ marginBottom: "40px" }}>
        <h3>Oefening 1: Array aanmaken en benaderen</h3>
        <p>
          Maak een array <code>getallen</code> met de waarden [5, 10, 15].
          <br />
          Print het eerste element (index 0).
        </p>
        <CodeEditor
          initialCode={`// Maak hier je array en print het eerste element

`}
          validation={(code) => {
            if (!code.includes("[") || !code.includes("]")) {
              return {
                valid: false,
                message: "Maak een array met vierkante haken",
              };
            }
            if (
              !code.includes("5") ||
              !code.includes("10") ||
              !code.includes("15")
            ) {
              return {
                valid: false,
                message: "Zorg dat de array de waarden 5, 10 en 15 bevat",
              };
            }
            if (!code.includes("[0]")) {
              return {
                valid: false,
                message: "Gebruik index [0] om het eerste element te benaderen",
              };
            }
            if (!code.includes("console.log")) {
              return {
                valid: false,
                message: "Gebruik console.log om het element te printen",
              };
            }
            return {
              valid: true,
              message:
                "Goed gedaan! Je hebt de array correct aangemaakt en benaderd.",
            };
          }}
        />
      </div>

      <div>
        <h3>Oefening 2: Array methodes</h3>
        <p>
          Gegeven: <code>const namen = ["Anna", "Bob"];</code>
          <br />
          Gebruik <code>push()</code> om "Chris" toe te voegen.
          <br />
          Gebruik <code>console.log(namen)</code> om de array te printen.
        </p>
        <CodeEditor
          initialCode={`const namen = ["Anna", "Bob"];

// Gebruik push() om Chris toe te voegen
// Print daarna de hele array

`}
          validation={(code) => {
            if (!code.includes("push")) {
              return { valid: false, message: "Gebruik de push() methode" };
            }
            if (!code.includes("Chris")) {
              return { valid: false, message: "Voeg 'Chris' toe met push" };
            }
            if (
              !code.includes("console.log") &&
              !code.includes("console . log")
            ) {
              return {
                valid: false,
                message: "Gebruik console.log om de array te printen",
              };
            }
            return {
              valid: true,
              message: "Goed gedaan! Je hebt push() correct gebruikt.",
            };
          }}
        />
      </div>

      <NextButton />
    </div>
  );
}
