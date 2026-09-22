import { toast } from "sonner";
import { getApiError } from "./api";

function show(run: () => void) {
  window.setTimeout(run, 0);
}

export function toastError(error: unknown) {
  const message =
    typeof error === "string"
      ? error
      : getApiError(error) || "Не получилось выполнить запрос";
  show(() => {
    toast.error(message);
  });
}

export function toastSuccess(message: string) {
  show(() => {
    toast.success(message);
  });
}
