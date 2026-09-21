import { Check, Link2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/shared/lib/utils";

type CopyLinkButtonProps = {
  hash?: string;
  className?: string;
};

export function CopyLinkButton({ hash, className }: CopyLinkButtonProps) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    const url = new URL(window.location.href);
    url.hash = hash ?? "";
    await navigator.clipboard.writeText(url.toString());
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      type="button"
      aria-label={copied ? "Ссылка скопирована" : "Копировать ссылку"}
      className={cn(
        "text-muted-foreground hover:text-foreground focus-visible:text-foreground inline-flex size-7 shrink-0 items-center justify-center rounded-md opacity-70 transition-opacity hover:bg-accent focus-visible:opacity-100 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100",
        className,
      )}
      onClick={() => {
        void copy();
      }}
    >
      {copied ? <Check className="size-3.5" /> : <Link2 className="size-3.5" />}
    </button>
  );
}
