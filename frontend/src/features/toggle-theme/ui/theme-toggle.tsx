import { useAtom } from "jotai";
import { MoonStar, Sun } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { themeAtom } from "../model/theme-atom";

export function ThemeToggle() {
  const [theme, setTheme] = useAtom(themeAtom);
  const next = theme === "dark" ? "light" : "dark";

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label={
        next === "dark" ? "Включить тёмную тему" : "Включить светлую тему"
      }
      onClick={() => setTheme(next)}
    >
      {theme === "dark" ? <Sun /> : <MoonStar />}
    </Button>
  );
}
