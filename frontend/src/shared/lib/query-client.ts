import { QueryClient } from "@tanstack/react-query";
import { toastError } from "./toast";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Number.POSITIVE_INFINITY,
      refetchOnWindowFocus: false,
    },
    mutations: {
      onError: toastError,
    },
  },
});
