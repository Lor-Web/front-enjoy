import type { ReactNode } from "react";
import { cn } from "@/shared/lib/utils";
import { BackToTop } from "@/widgets/back-to-top";
import { Header } from "@/widgets/header";

type AppShellProps = {
  children: ReactNode;
  sidebar?: ReactNode;
  footer?: ReactNode;
  navTitle?: string;
  navDescription?: string;
};

export function AppShell({
  children,
  sidebar,
  footer,
  navTitle,
  navDescription,
}: AppShellProps) {
  return (
    <div className="flex min-h-svh flex-col">
      <a
        href="#content"
        className="bg-primary text-primary-foreground sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:px-3 focus:py-2"
      >
        К содержанию
      </a>
      <Header
        mobileNav={sidebar}
        navTitle={navTitle}
        navDescription={navDescription}
      />
      <div className="mx-auto flex w-full max-w-6xl flex-1">
        {sidebar ? (
          <aside className="sticky top-14 hidden h-[calc(100svh-3.5rem)] w-72 shrink-0 overflow-y-auto border-r lg:block">
            {sidebar}
          </aside>
        ) : null}
        <main
          id="content"
          className={cn(
            "min-w-0 flex-1 px-4 py-8 sm:px-6 lg:px-10",
            footer && "pb-40 sm:pb-24",
          )}
        >
          {children}
        </main>
      </div>
      <BackToTop raised={Boolean(footer)} />
      {footer ? (
        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30">
          <div className="mx-auto flex max-w-6xl">
            {sidebar ? (
              <div className="hidden w-72 shrink-0 lg:block" aria-hidden />
            ) : null}
            <div className="pointer-events-auto min-w-0 flex-1 border-t border-border/70 bg-background/70 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md sm:px-6 lg:px-10">
              {footer}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
