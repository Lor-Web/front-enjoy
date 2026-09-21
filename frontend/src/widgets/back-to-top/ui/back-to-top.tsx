import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";

type BackToTopProps = {
  raised?: boolean;
};

export function BackToTop({ raised = false }: BackToTopProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 400);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <Button
      type="button"
      size="sm"
      className={cn(
        "fixed right-4 z-40 shadow-md sm:right-6",
        raised ? "bottom-24" : "bottom-4",
      )}
      aria-label="Наверх"
      onClick={() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }}
    >
      <ArrowUp />
      Наверх
    </Button>
  );
}
