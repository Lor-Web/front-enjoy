import { useQuery } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { meQueryOptions } from "@/entities/user";
import { tokenAtom } from "./token-atom";

export function useMe() {
  const token = useAtomValue(tokenAtom);
  return useQuery(meQueryOptions(token));
}
