import { atomWithStorage } from "jotai/utils";

export const navExpandedAtom = atomWithStorage<Record<string, boolean>>(
  "fe-nav-expanded",
  {},
  undefined,
  { getOnInit: true },
);
