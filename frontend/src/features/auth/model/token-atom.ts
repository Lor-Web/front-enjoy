import { atomWithStorage } from "jotai/utils";

export const tokenAtom = atomWithStorage<string | null>(
  "fe-auth-token",
  null,
  undefined,
  { getOnInit: true },
);
