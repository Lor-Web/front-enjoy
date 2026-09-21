import { useAtomValue } from "jotai";
import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router";
import { routes } from "@/shared/config/routes";
import { tokenAtom } from "../model/token-atom";

export function RequireAuth({ children }: { children: ReactNode }) {
  const token = useAtomValue(tokenAtom);
  const location = useLocation();

  if (!token) {
    return (
      <Navigate to={routes.login} replace state={{ from: location.pathname }} />
    );
  }

  return children;
}
