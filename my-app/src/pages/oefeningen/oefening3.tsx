import { useState, useRef, useEffect } from "react";
import * as monaco from "monaco-editor";
import style from "./oefeningen.module.scss";
import NextButton from "../../components/nextButton";

const initialCode = `let leeftijd = 20;

// Schrijf een if statement dat controleert
// of iemand volwassen is (leeftijd >= 18)
// en toon "Volwassen" of "Niet volwassen"

`;

const solutionCode = `let leeftijd = 20;

if (leeftijd >= 18) {
  console.log("Volwassen");
} else {
  console.log("Niet volwassen");
}`;

const btnStyle = {
  padding: "8px 16px",
  cursor: "pointer",
  backgroundColor: "#007bff",
  color: "white",
  border: "none",
  borderRadius: "4px",
};

function Oefening3() {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    if (!containerRef.current) return;

    const editor = monaco.editor.create(containerRef.current, {
      value: initialCode,
      language: "javascript",
      theme: "vs-dark",
      minimap: { enabled: false },
      fontSize: 14,
      automaticLayout: true,
    });

    editorRef.current = editor;

    return () => editor.dispose();
  }, []);

  function runCode() {
    const code = editorRef.current?.getValue() || "";
    setFeedback("");

    try {
      const originalLog = console.log;
      const logs: string[] = [];

      console.log = (...args) => {
        logs.push(args.join(" "));
      };

      eval(code);

      console.log = originalLog;

      const result = logs.join("\n");

      if (code.includes("if") && code.includes(">=")) {
        if (result.includes("Volwassen") || result.includes("Niet volwassen")) {
          setFeedback("Goed gedaan! Je if statement werkt correct!");
        } else {
          setFeedback("Gebruik console.log() om iets te tonen.");
        }
      } else {
        setFeedback("Gebruik een if statement met de >= operator.");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setFeedback(`Fout: ${errorMessage}`);
    }
  }

  function showAnswer() {
    editorRef.current?.setValue(solutionCode);
  }

  function resetCode() {
    setFeedback("");
    editorRef.current?.setValue(initialCode);
  }

  return (
    <div className={style.oefeningBox}>
      <h2>If Statement</h2>

      <div
        style={{ padding: "15px", borderRadius: "8px", marginBottom: "20px" }}
      >
        <h3>Uitleg</h3>
        <p>
          Eerst wat uitleg over waar dit vooral gebruikt wordt: <br /> <br />
          Stel je een website voor als een restaurant.
          <br /> <br />
          Wat je ziet (de front-end) is de eetzaal: de tafels, het menu, de
          decoratie. Dat is wat de bezoeker ziet en aanraakt — de knoppen, de
          tekst, de kleuren. <br /> <br />
          Wat achter de schermen gebeurt (de back-end) is de keuken: de plek
          waar het echte werk gedaan wordt, maar die de klant nooit ziet.
          <br />
          <br />
          De back-end bestaat grofweg uit drie dingen: <br /> <br />
          1. De server — dit is een computer die altijd aanstaat en wacht op
          verzoeken. Als jij op een knop klikt, stuurt de browser een berichtje
          naar de server: "geef mij die data" of "sla dit op". De server
          verwerkt dat verzoek en stuurt een antwoord terug. <br /> <br />
          2. De applicatielogica — dit is de code die bepaalt wat er precies
          moet gebeuren. Mag deze gebruiker inloggen? Wat is de prijs na
          korting? Welke berichten mag hij zien? Al die regels zitten hier.{" "}
          <br /> <br />
          3. De database — dit is waar alle gegevens worden bewaard.
          Gebruikersnamen, wachtwoorden, bestellingen, berichten... alles wat de
          website moet onthouden staat hier opgeslagen. <br /> <br />
          De flow is simpel: jij klikt op iets → de browser stuurt een verzoek
          naar de server → de server voert logica uit en raadpleegt eventueel de
          database → de server stuurt een antwoord terug → de browser toont het
          resultaat. <br /> <br />
          In de komende oefeningen gaan we een aantal basisbegrippen bekijken
          die je in bijna elke back-end tegenkomt, zoals variabelen, functies,
          en hoe je met een database praat. <br /> <br />
          Om te beginnen dus, het if-statement.
          <br /> <br />
          Voordat we beginnen: <br /> <br />
          console.log() is een manier om iets af te drukken in de console (die
          open je zo: bij Windows druk je op F12 of Ctrl + Shift + I en voor Mac
          druk je op Cmd + Option + I), zodat jij als ontwikkelaar kan zien wat
          er gebeurt in je code.
          <br /> <br />
        </p>
        <p>
          Een <strong>if statement</strong> wordt gebruikt om beslissingen te
          maken in je code op basis van een voorwaarde.
        </p>
        <ul>
          <li key="if">
            <strong>if (voorwaarde)</strong> - controleer of iets waar is
          </li>
          <li key="else">
            <strong>else</strong> - wat te doen als de voorwaarde niet waar is
          </li>
          <li key="gt">
            <strong>&gt;</strong> - groter dan
          </li>
          <li key="gte">
            <strong>&gt;=</strong> - groter of gelijk aan
          </li>
          <li key="lt">
            <strong>&lt;</strong> - kleiner dan
          </li>
          <li key="lte">
            <strong>&lt;=</strong> - kleiner of gelijk aan
          </li>
          <li key="eq">
            <strong>===</strong> - is gelijk aan
          </li>
          <li key="neq">
            <strong>!==</strong> - is niet gelijk aan
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
          {`let leeftijd = 20;

if (leeftijd >= 18) {
  console.log("Volwassen");
} else {
  console.log("Niet volwassen");
}`}
        </pre>
      </div>

      <p>
        <strong>Opgave:</strong> Schrijf een if statement dat controleert of
        iemand volwassen is.
      </p>

      <ul>
        <li key="var">
          De variabele <code>leeftijd</code> is al gedefinieerd
        </li>
        <li key="check">
          Controleer of <code>leeftijd &gt;= 18</code>
        </li>
        <li key="show">
          Toon "Volwassen" als dat zo is, anders "Niet volwassen"
        </li>
      </ul>

      <div
        ref={containerRef}
        style={{
          height: "300px",
          border: "1px solid #ccc",
          marginBottom: "15px",
        }}
      />

      <div style={{ display: "flex", gap: "10px" }}>
        <button onClick={runCode} style={btnStyle}>
          Run Code
        </button>
        <button onClick={resetCode} style={btnStyle}>
          Reset
        </button>
        <button onClick={showAnswer} style={btnStyle}>
          Toon Oplossing
        </button>
      </div>

      {feedback && (
        <div
          style={{
            marginTop: "15px",
            padding: "10px",
            backgroundColor: feedback.includes("Goed") ? "#d4edda" : "#f8d7da",
            borderRadius: "5px",
          }}
        >
          {feedback}
        </div>
      )}

      <NextButton />
    </div>
  );
}

export default Oefening3;
