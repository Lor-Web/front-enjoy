import { GitHubIcon } from "@/entities/user";
import { Button } from "@/shared/ui/button";
import { useGithubConnect } from "../model/use-github";
import { useGithubCallbackToast } from "../model/use-github-callback";

type GithubConnectProps = {
  githubLogin: string | null;
};

export function GithubConnect({ githubLogin }: GithubConnectProps) {
  useGithubCallbackToast();
  const { connect, disconnect } = useGithubConnect();

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
          onClick={() => connect.mutate("/me")}
        >
          Подключить
        </Button>
      )}
    </div>
  );
}
