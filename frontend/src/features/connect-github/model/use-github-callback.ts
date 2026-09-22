import { useEffect } from "react";
import { useSearchParams } from "react-router";
import { toastError, toastSuccess } from "@/shared/lib/toast";

const CALLBACK: Record<string, { ok: boolean; text: string }> = {
  linked: { ok: true, text: "GitHub подключён" },
  denied: { ok: false, text: "Вы не дали доступ GitHub" },
  taken: {
    ok: false,
    text: "Этот GitHub уже привязан к другому аккаунту",
  },
  error: { ok: false, text: "Не получилось подключить GitHub" },
};

export function useGithubCallbackToast() {
  const [params, setParams] = useSearchParams();

  useEffect(() => {
    const status = params.get("github");
    if (!status) {
      return;
    }
    const message = CALLBACK[status];
    if (message?.ok) {
      toastSuccess(message.text);
    } else if (message) {
      toastError(message.text);
    }
    const next = new URLSearchParams(params);
    next.delete("github");
    setParams(next, { replace: true });
  }, [params, setParams]);
}
