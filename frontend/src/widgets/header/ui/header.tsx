import { Menu } from "lucide-react";
import type { ReactNode } from "react";
import { Link, NavLink } from "react-router";
import { AuthMenu } from "@/features/auth";
import { ThemeToggle } from "@/features/toggle-theme";
import { routes } from "@/shared/config/routes";
import { Button } from "@/shared/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/ui/sheet";
import { DocsNav } from "./docs-nav";

type HeaderProps = {
  mobileNav?: ReactNode;
  navTitle?: string;
  navDescription?: string;
};

export function Header({
  mobileNav,
  navTitle = "Уроки",
  navDescription = "Навигация по треку React",
}: HeaderProps) {
  return (
    <header className="bg-background/90 sticky top-0 z-40 border-b backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-2 overflow-hidden px-4 sm:px-6">
        {mobileNav ? (
          <Sheet>
            <SheetTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="lg:hidden"
                aria-label="Открыть оглавление"
              >
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0">
              <SheetHeader className="border-b">
                <SheetTitle>{navTitle}</SheetTitle>
                <SheetDescription>{navDescription}</SheetDescription>
              </SheetHeader>
              <div className="min-h-0 flex-1 overflow-y-auto">{mobileNav}</div>
            </SheetContent>
          </Sheet>
        ) : null}

        <Link
          to={routes.home}
          className="hover:text-primary shrink-0 font-serif text-lg font-medium tracking-tight whitespace-nowrap transition-colors"
        >
          Front Enjoy
        </Link>

        <nav className="ml-2 flex min-w-0 items-center gap-1 text-sm sm:gap-3">
          <div className="hidden sm:block">
            <DocsNav />
          </div>
          <NavLink
            to={routes.courses}
            className={({ isActive }) =>
              isActive
                ? "bg-accent text-foreground rounded-md px-2 py-1"
                : "text-muted-foreground hover:bg-accent/70 hover:text-foreground rounded-md px-2 py-1 transition-colors"
            }
          >
            Курсы
          </NavLink>
          <NavLink
            to={routes.users}
            end
            className={({ isActive }) =>
              isActive
                ? "bg-accent text-foreground hidden rounded-md px-2 py-1 md:inline"
                : "text-muted-foreground hover:bg-accent/70 hover:text-foreground hidden rounded-md px-2 py-1 transition-colors md:inline"
            }
          >
            Пользователи
          </NavLink>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <AuthMenu />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
