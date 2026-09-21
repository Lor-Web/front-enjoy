import { DOC_TECHS } from "@/shared/config/docs";
import { AppShell } from "@/widgets/app-shell";
import { TechCard } from "./tech-card";

export function DocsPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-3 text-3xl sm:text-4xl">Документация</h1>
        <p className="text-muted-foreground mb-8 text-[17px] leading-7">
          Выберите технологию, чтобы открыть уроки.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {DOC_TECHS.map((tech) => (
            <TechCard key={tech.id} tech={tech} />
          ))}
        </div>
      </div>
    </AppShell>
  );
}
