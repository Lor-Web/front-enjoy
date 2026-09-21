import { QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "jotai";
import type { ReactNode } from "react";
import { ThemeSync } from "@/features/toggle-theme";
import { queryClient } from "@/shared/lib/query-client";

type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <Provider>
      <QueryClientProvider client={queryClient}>
        <ThemeSync />
        {children}
      </QueryClientProvider>
    </Provider>
  );
}
