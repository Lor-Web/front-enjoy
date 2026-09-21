import { useAtomValue } from "jotai";
import { useEffect } from "react";
import { themeAtom } from "../model/theme-atom";

export function ThemeSync() {
  const theme = useAtomValue(themeAtom);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return null;
}
