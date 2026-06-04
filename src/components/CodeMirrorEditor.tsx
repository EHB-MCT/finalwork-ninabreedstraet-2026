import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { oneDark } from "@codemirror/theme-one-dark";
import style from "../components/panelsComponents/accordion/accordionPanel.module.scss";

interface CodeEditorProps {
  value: string;
  onChange: (code: string) => void;
  height?: string;
}

export function CodeMirrorEditor({
  value,
  onChange,
  height = "400px",
}: Readonly<CodeEditorProps>) {
  return (
    <CodeMirror
      value={value}
      height={height}
      theme={oneDark}
      extensions={[javascript()]}
      onChange={(value) => onChange(value)}
      className={style.codeMirrorEditor}
    />
  );
}
