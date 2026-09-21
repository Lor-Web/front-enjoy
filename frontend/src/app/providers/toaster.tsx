import { useAtomValue } from "jotai";
import type { CSSProperties } from "react";
import { Toaster as Sonner } from "sonner";
import { themeAtom } from "@/features/toggle-theme";

export function Toaster() {
  const theme = useAtomValue(themeAtom);

  return (
    <Sonner
      theme={theme}
      position="bottom-right"
      closeButton
      richColors
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as CSSProperties
      }
    />
  );
}
