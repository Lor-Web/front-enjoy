import { css } from "@codemirror/lang-css";
import { html } from "@codemirror/lang-html";
import { javascript } from "@codemirror/lang-javascript";
import { json } from "@codemirror/lang-json";
import CodeMirror from "@uiw/react-codemirror";
import { useAtomValue } from "jotai";
import { themeAtom } from "@/features/toggle-theme";

type TaskEditorProps = {
  path: string;
  value: string;
  readOnly?: boolean;
  onChange: (value: string) => void;
};

export function TaskEditor({
  path,
  value,
  readOnly = false,
  onChange,
}: TaskEditorProps) {
  const theme = useAtomValue(themeAtom);

  return (
    <CodeMirror
      value={value}
      height="100%"
      theme={theme === "dark" ? "dark" : "light"}
      extensions={[languageFor(path)]}
      onChange={onChange}
      readOnly={readOnly}
      basicSetup={{ foldGutter: false, autocompletion: false }}
      className="h-full overflow-hidden [&_.cm-editor]:h-full [&_.cm-scroller]:font-mono"
    />
  );
}

function languageFor(path: string) {
  if (path.endsWith(".css")) {
    return css();
  }
  if (path.endsWith(".json")) {
    return json();
  }
  if (path.endsWith(".html")) {
    return html();
  }
  return javascript({
    jsx: true,
    typescript: path.endsWith(".ts") || path.endsWith(".tsx"),
  });
}
