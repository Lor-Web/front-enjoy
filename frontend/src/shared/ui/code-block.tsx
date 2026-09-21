import { Check, Copy } from "lucide-react";
import {
  Children,
  type ComponentProps,
  isValidElement,
  type ReactNode,
  useRef,
} from "react";
import { useCopied } from "@/shared/lib/use-copied";
import { cn } from "@/shared/lib/utils";

// Подсветка — rehype-pretty-code + shiki на сборке. Здесь только рамка: язык и копирование.
// highlight.js / react-syntax-highlighter не подключать: будет второй движок в браузере.

const LANGUAGE_LABELS: Record<string, string> = {
  js: "JavaScript",
  jsx: "JSX",
  ts: "TypeScript",
  tsx: "TSX",
  bash: "Bash",
  sh: "Shell",
  json: "JSON",
  css: "CSS",
  html: "HTML",
  mdx: "MDX",
};

type CodeBlockProps = ComponentProps<"pre"> & {
  "data-language"?: string;
};

export function CodeBlock({ children, className, ...props }: CodeBlockProps) {
  const preRef = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useCopied();
  const language =
    (typeof props["data-language"] === "string" && props["data-language"]) ||
    languageFromChildren(children);
  const label = language
    ? (LANGUAGE_LABELS[language] ?? language.toUpperCase())
    : "Код";

  const copy = async () => {
    const text = preRef.current?.textContent ?? "";
    await navigator.clipboard.writeText(text);
    setCopied(true);
  };

  return (
    <div className="bg-muted/60 mb-5 overflow-hidden rounded-md border">
      <div className="flex items-center justify-between gap-3 border-b px-3 py-1.5">
        <span className="text-muted-foreground font-mono text-[11px] tracking-wide uppercase">
          {label}
        </span>
        <button
          type="button"
          aria-label={copied ? "Код скопирован" : "Копировать код"}
          className="text-muted-foreground hover:text-foreground inline-flex size-7 items-center justify-center rounded-md hover:bg-accent"
          onClick={() => {
            void copy();
          }}
        >
          {copied ? (
            <Check className="size-3.5" />
          ) : (
            <Copy className="size-3.5" />
          )}
        </button>
      </div>
      <pre
        ref={preRef}
        className={cn(
          "overflow-x-auto p-4 font-mono text-[13px] leading-6",
          className,
        )}
        {...props}
      >
        {children}
      </pre>
    </div>
  );
}

function languageFromChildren(children: ReactNode) {
  for (const child of Children.toArray(children)) {
    if (!isValidElement<{ className?: string }>(child)) {
      continue;
    }
    const match = child.props.className?.match(/language-([\w-]+)/);
    if (match) {
      return match[1];
    }
  }
  return undefined;
}
