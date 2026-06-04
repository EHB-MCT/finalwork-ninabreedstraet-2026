import { useState, useRef, useEffect } from "react";
import * as monaco from "monaco-editor";

import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import jsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";
import cssWorker from "monaco-editor/esm/vs/language/css/css.worker?worker";
import htmlWorker from "monaco-editor/esm/vs/language/html/html.worker?worker";
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";
import { CodeMirrorEditor } from "./CodeMirrorEditor";

interface CodeEditorProps {
  initialCode: string;
  language?: string;
  validation: (code: string) => {
    message: string;
  };
}

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
}: Readonly<CodeEditorProps>) {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const containerRef = useRef(null);
  const [feedback, setFeedback] = useState("");
  const [code, setCode] = useState(initialCode);

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
