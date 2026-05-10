import { CodeEditor } from "../../components/codeEditor";
import NextButton from "../../components/nextButton";
import style from "./oefeningen.module.scss";

export default function Oefening6() {
  return (
    <div className={style.oefeningBox}>
      <h2>Data Structuren</h2>

      <div
        style={{ padding: "15px", borderRadius: "8px", marginBottom: "20px" }}
      >
        <h3>Uitleg</h3>
        <p>
          In JavaScript zijn er verschillende manieren om data te organiseren.
        </p>
        <ul>
          <li>
            <strong>Array:</strong> Een geordende lijst van waarden
          </li>
          <li>
            <strong>Object:</strong> Key-value paren
          </li>
          <li>
            <strong>Map:</strong> Collection van key-value paren
          </li>
          <li>
            <strong>Set:</strong> Unieke waarden
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
        <h3>Oefening 1: Objecten</h3>
        <p>
          Maak een object <code>auto</code> met:
          <br />
          - merk: "Toyota"
          <br />
          - bouwjaar: 2020
          <br />
          Print het merk met <code>console.log</code>.
        </p>
        <CodeEditor
          initialCode={`// Maak hier het auto object en print het merk

`}
          validation={(code: string | string[]) => {
            if (!code.includes("{")) {
              return {
                message: "Maak een object met curly braces",
              };
            }
            if (!code.includes("Toyota")) {
              return {
                message: "Gebruik Toyota als merk",
              };
            }
            if (!code.includes("2020")) {
              return {
                message: "Gebruik 2020 als bouwjaar",
              };
            }
            if (!code.includes("merkt")) {
              return {
                message: "Gebruik de naam 'merk' als property",
              };
            }
            return {
              message: "Goed gedaan! Je hebt het object correct aangemaakt.",
            };
          }}
        />
      </div>

      <div>
        <h3>Oefening 2: Geneste data</h3>
        <p>
          Maak een array <code>studenten</code> met twee objecten:
          <br />
          - eerste student: naam "Anna", cijfer 8
          <br />
          - tweede student: naam "Bob", cijfer 7
          <br />
          Print de hele array.
        </p>
        <CodeEditor
          initialCode={`// Maak de studenten array met twee studenten en print deze

`}
          validation={(code: string | string[]) => {
            if (!code.includes("[")) {
              return {
                message: "Maak een array met vierkante haken",
              };
            }
            if (!code.includes("Anna")) {
              return {
                message: "Voeg Anna toe als eerste student",
              };
            }
            if (!code.includes("Bob")) {
              return {
                message: "Voeg Bob toe als tweede student",
              };
            }
            if (
              !code.includes("console.log") &&
              !code.includes("console . log")
            ) {
              return {
                message: "Gebruik console.log om de array te printen",
              };
            }
            return {
              message:
                "Goed gedaan! Je hebt de geneste data structuur correct aangemaakt.",
            };
          }}
        />
      </div>

      <NextButton />
    </div>
  );
}
