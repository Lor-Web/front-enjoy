import { Menu } from "lucide-react";
import type { ReactNode } from "react";
import { Link, NavLink } from "react-router";
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

type HeaderProps = {
  mobileNav?: ReactNode;
};

export function Header({ mobileNav }: HeaderProps) {
  return (
    <header className="bg-background/90 sticky top-0 z-40 border-b backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-2 px-4 sm:px-6">
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
                <SheetTitle>Уроки</SheetTitle>
                <SheetDescription>Навигация по треку React</SheetDescription>
              </SheetHeader>
              <div className="min-h-0 flex-1 overflow-y-auto">{mobileNav}</div>
            </SheetContent>
          </Sheet>
        ) : null}

        <Link
          to={routes.home}
          className="font-serif text-lg font-medium tracking-tight"
        >
          Front Enjoy
        </Link>

        <nav className="ml-2 hidden items-center gap-4 text-sm sm:flex">
          <NavLink
            to={routes.catalog}
            className={({ isActive }) =>
              isActive
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }
          >
            Трек React
          </NavLink>
        </nav>

        <div className="ml-auto">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
