import { api } from "@/shared/lib/api";
import { normalizeProgress, type ProgressState } from "../model/types";

function readStoredToken() {
  const raw = localStorage.getItem("fe-auth-token");
  if (!raw || raw === "null") {
    return null;
  }
  try {
    return JSON.parse(raw) as string | null;
  } catch {
    return null;
  }
}

export async function persistProgress(
  state: ProgressState,
  token: string | null | undefined = undefined,
) {
  const resolved = token === undefined ? readStoredToken() : token;
  if (!resolved) {
    return undefined;
  }
  const { data } = await api.put<ProgressState>(
    "/progress/me",
    normalizeProgress(state),
  );
  return normalizeProgress(data);
}
