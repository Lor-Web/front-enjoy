import { Link } from "react-router";
import { routes } from "@/shared/config/routes";
import { Button } from "@/shared/ui/button";
import { TechIcon } from "@/shared/ui/tech-icon";
import { AppShell } from "@/widgets/app-shell";

export function JavascriptPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-2xl">
        <div className="mb-5 flex items-center gap-3">
          <span className="flex size-12 items-center justify-center rounded-lg bg-[#F7DF1E] text-black">
            <TechIcon id="javascript" className="size-8" />
          </span>
          <h1 className="text-3xl sm:text-4xl">JavaScript</h1>
        </div>
        <p className="text-muted-foreground mb-8 text-[17px] leading-7">
          Раздел в работе. Скоро здесь появятся уроки по языку.
        </p>
        <Button asChild variant="outline">
          <Link to={routes.docs}>Ко всем разделам</Link>
        </Button>
      </div>
    </AppShell>
  );
}
