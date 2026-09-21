import { Link } from "react-router";
import { routes } from "@/shared/config/routes";
import { Button } from "@/shared/ui/button";
import { AppShell } from "@/widgets/app-shell";

export function NotFoundPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-2xl py-12">
        <h1 className="mb-3 text-3xl">Страница не найдена</h1>
        <p className="text-muted-foreground mb-6">
          Проверьте адрес или вернитесь к треку React.
        </p>
        <Button asChild>
          <Link to={routes.catalog}>К каталогу</Link>
        </Button>
      </div>
    </AppShell>
  );
}
