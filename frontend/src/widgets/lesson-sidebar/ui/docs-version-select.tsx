import { useSearchParams } from "react-router";
import { TRACK_VERSION_LATEST, TRACK_VERSIONS } from "@/shared/config/tracks";
import { useDocVersion } from "@/shared/lib/doc-version";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";

export function DocsVersionSelect() {
  const [, setParams] = useSearchParams();
  const selected = useDocVersion();

  function onVersionChange(next: string) {
    setParams(
      (current) => {
        const copy = new URLSearchParams(current);
        if (next === TRACK_VERSION_LATEST) {
          copy.delete("v");
        } else {
          copy.set("v", next);
        }
        return copy;
      },
      { replace: true },
    );
  }

  return (
    <Select value={selected} onValueChange={onVersionChange}>
      <SelectTrigger
        size="sm"
        aria-label="Версия документации"
        className="h-7 w-auto min-w-14 shrink-0 gap-1 border-border/70 bg-transparent px-2 text-xs shadow-none"
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent
        align="end"
        className="min-w-[var(--radix-select-trigger-width)]"
      >
        {TRACK_VERSIONS.map((version) => (
          <SelectItem key={version.id} value={version.id}>
            {version.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
