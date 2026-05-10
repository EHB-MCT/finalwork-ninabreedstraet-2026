import { CodeEditor } from "../../components/codeEditor";
import NextButton from "../../components/nextButton";
import style from "./oefeningen.module.scss";

export default function Oefening8() {
  return (
    <div className={style.oefeningBox}>
      <h2>For Loops</h2>

      <div
        style={{ padding: "15px", borderRadius: "8px", marginBottom: "20px" }}
      >
        <h3>Uitleg</h3>
        <p>
          Een <strong>for loop</strong> wordt gebruikt om een codeblock meerdere
          keren uit te voeren.
        </p>
        <ul>
          <li>
            <strong>for (let i = start; i &lt; voorwaarde; i++)</strong> -
            klassieke for loop
          </li>
          <li>
            <strong>for (const item of array)</strong> - itereren over array
            elementen
          </li>
          <li>
            <strong>for (const key in object)</strong> - itereren over object
            keys
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
          {`// Klassieke for loop
for (let i = 0; i < 5; i++) {
  console.log(i); // 0, 1, 2, 3, 4
}

// For...of (array)
const fruit = ["appel", "peer", "banaan"];
for (const fr of fruit) {
  console.log(fr);
}`}
        </pre>
      </div>

      <div style={{ marginBottom: "40px" }}>
        <h3>Oefening 1: Klassieke for loop</h3>
        <p>
          Schrijf een for loop die de getallen 0 tot en met 4 print
          (console.log).
        </p>
        <CodeEditor
          initialCode={`// Schrijf hier je for loop

`}
          validation={(code) => {
            if (!code.includes("for")) {
              return { message: "Gebruik een for loop" };
            }
            if (
              !code.includes("let") &&
              !code.includes("var") &&
              !code.includes("const")
            ) {
              return {
                message: "Declareer een variabele in de for loop",
              };
            }
            if (
              !code.includes("console.log") &&
              !code.includes("console . log")
            ) {
              return {
                message: "Gebruik console.log om getallen te printen",
              };
            }
            return {
              message: "Goed gedaan! Je for loop werkt correct.",
            };
          }}
        />
      </div>

      <div>
        <h3>Oefening 2: For...of loop</h3>
        <p>
          Gegeven: <code>const getallen = [10, 20, 30];</code>
          <br />
          Schrijf een for...of loop die elke waarde print.
        </p>
        <CodeEditor
          initialCode={`const getallen = [10, 20, 30];

// Schrijf hier je for...of loop

`}
          validation={(code) => {
            if (!code.includes("for") && !code.includes("of")) {
              return { message: "Gebruik een for...of loop" };
            }
            if (!code.includes("getallen")) {
              return { message: "Gebruik de array 'getallen'" };
            }
            if (
              !code.includes("console.log") &&
              !code.includes("console . log")
            ) {
              return {
                message: "Gebruik console.log om waarden te printen",
              };
            }
            return {
              message: "Goed gedaan! Je for...of loop werkt correct.",
            };
          }}
        />
      </div>

      <NextButton />
    </div>
  );
}
