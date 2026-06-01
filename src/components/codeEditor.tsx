import { useState, useRef, useEffect } from "react";
import * as monaco from "monaco-editor";

import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import jsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";
import cssWorker from "monaco-editor/esm/vs/language/css/css.worker?worker";
import htmlWorker from "monaco-editor/esm/vs/language/html/html.worker?worker";
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";

window.MonacoEnvironment = {
  getWorker(_, label) {
    if (label === "json") return new jsonWorker();
    if (label === "css" || label === "scss" || label === "less")
      return new cssWorker();
    if (label === "html" || label === "handlebars" || label === "razor")
      return new htmlWorker();
    if (label === "typescript" || label === "javascript") return new tsWorker();
    return new editorWorker();
  },
};

export function CodeEditor({
  initialCode,
  language = "javascript",
  validation,
}) {
  const editorRef = useRef(null);
  const containerRef = useRef(null);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    if (!containerRef.current) return;

    const editor = monaco.editor.create(containerRef.current, {
      value: initialCode,
      language,
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
      const result = validation(code);
      setFeedback(result.message);
    } catch (err) {
      setFeedback(`Fout: ${err.message}`);
    }
  }

  return (
    <div>
      <div
        ref={containerRef}
        style={{
          height: "150px",
          border: "1px solid #ccc",
          marginBottom: "10px",
        }}
      />
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
