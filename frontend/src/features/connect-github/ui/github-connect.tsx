import { useEffect } from "react";
import { useSearchParams } from "react-router";
import { GitHubIcon } from "@/entities/user";
import { toastError, toastSuccess } from "@/shared/lib/toast";
import { Button } from "@/shared/ui/button";
import { useGithubConnect } from "../model/use-github";

const CALLBACK: Record<string, { ok: boolean; text: string }> = {
  linked: { ok: true, text: "GitHub подключён" },
  denied: { ok: false, text: "Вы не дали доступ GitHub" },
  taken: {
    ok: false,
    text: "Этот GitHub уже привязан к другому аккаунту",
  },
  error: { ok: false, text: "Не получилось подключить GitHub" },
};

type GithubConnectProps = {
  githubLogin: string | null;
};

export function GithubConnect({ githubLogin }: GithubConnectProps) {
  const [params, setParams] = useSearchParams();
  const { connect, disconnect } = useGithubConnect();

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

  return (
    <div className="hover:border-ring/40 mb-8 flex items-center justify-between gap-4 rounded-md border p-3 transition-colors">
      <p className="flex min-w-0 items-center gap-2 text-sm font-medium">
        <GitHubIcon className="size-4 shrink-0" />
        GitHub
        {githubLogin ? (
          <a
            href={`https://github.com/${githubLogin}`}
            className="text-primary truncate font-normal underline-offset-4 hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            {githubLogin}
          </a>
        ) : null}
      </p>
      {githubLogin ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disconnect.isPending}
          onClick={() => disconnect.mutate()}
        >
          Отключить
        </Button>
      ) : (
        <Button
          type="button"
          size="sm"
          disabled={connect.isPending}
          onClick={() => connect.mutate()}
        >
          Подключить
        </Button>
      )}
    </div>
  );
}
