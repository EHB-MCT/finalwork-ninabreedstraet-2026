import { useState, useRef, useEffect } from "react";
import { CodeMirrorEditor } from "./CodeMirrorEditor";

interface CodeEditorProps {
  initialCode: string;
  language?: string;
  validation: (code: string) => {
    message: string;
  };
}

export function CodeEditor({
  initialCode,
  validation,
}: Readonly<CodeEditorProps>) {
  const [feedback, setFeedback] = useState("");
  const [code, setCode] = useState(initialCode);

  function runCode() {
    setFeedback("");

    try {
      const result = validation(code);
      setFeedback(result.message);
    } catch (err) {
      if (err instanceof Error) {
        setFeedback(`Fout: ${err.message}`);
      } else {
        setFeedback("Onbekende fout");
      }
    }
  }

  return (
    <div>
      <CodeMirrorEditor value={code} onChange={setCode} height="150px" />

      <button onClick={runCode} style={btnStyle}>
        Run Code
      </button>
      {feedback && (
        <div
          style={{
            marginTop: "10px",
            padding: "10px",
            backgroundColor: feedback.includes("Goed") ? "#d4edda" : "#f8d7da",
            borderRadius: "5px",
            color: "#000000",
            mixBlendMode: "difference",
          }}
        >
          {feedback}
        </div>
      )}
    </div>
  );
}

export const btnStyle = {
  padding: "8px 16px",
  cursor: "pointer",
  backgroundColor: "#007bff",
  color: "white",
  border: "none",
  borderRadius: "4px",
};

export const exercises = [
  "/oefening1",
  "/oefening2",
  "/oefening3",
  "/oefening4",
  "/oefening5",
  "/oefening6",
  "/oefening7",
  "/oefening8",
];
