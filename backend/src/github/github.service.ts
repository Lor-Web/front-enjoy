import {
  BadGatewayException,
  Injectable,
  ServiceUnavailableException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

type GithubUser = {
  id: number;
  login: string;
};

type GithubRepo = {
  name: string;
  html_url: string;
  owner: { login: string };
  default_branch?: string;
};

type GithubFile = {
  sha: string;
  content?: string;
  encoding?: string;
};

export type HomeworkChecksState = "pending" | "success" | "failure" | "unknown";

@Injectable()
export class GithubService {
  constructor(private readonly config: ConfigService) {}

  oauthConfigured() {
    return Boolean(
      this.clientId() && this.clientSecret() && this.callbackUrl(),
    );
  }

  repoCreateConfigured() {
    return Boolean(this.templatesOwner() && this.orgToken());
  }

  authorizeUrl(state: string) {
    this.requireOauth();
    const url = new URL("https://github.com/login/oauth/authorize");
    url.searchParams.set("client_id", this.clientId());
    url.searchParams.set("redirect_uri", this.callbackUrl());
    url.searchParams.set("scope", "read:user");
    url.searchParams.set("state", state);
    return url.toString();
  }

  async userFromCode(code: string): Promise<GithubUser> {
    this.requireOauth();
    const token = await this.exchangeCode(code);
    return this.request<GithubUser>("/user", { token });
  }

  async createFromTemplate(input: {
    templateRepo: string;
    name: string;
    description: string;
  }): Promise<GithubRepo> {
    this.requireRepoCreate();
    const owner = this.templatesOwner();
    return this.request<GithubRepo>(
      `/repos/${owner}/${input.templateRepo}/generate`,
      {
        token: this.orgToken(),
        method: "POST",
        body: {
          owner,
          name: input.name,
          description: input.description,
          private: false,
          include_all_branches: false,
        },
      },
    );
  }

  async getRepo(owner: string, name: string) {
    this.requireRepoCreate();
    return this.request<GithubRepo | null>(`/repos/${owner}/${name}`, {
      token: this.orgToken(),
      missing: "null",
    });
  }

  async getFile(
    owner: string,
    name: string,
    path: string,
    ref?: string,
  ): Promise<GithubFile | null> {
    this.requireRepoCreate();
    const query = ref ? `?ref=${encodeURIComponent(ref)}` : "";
    return this.request<GithubFile | null>(
      `/repos/${owner}/${name}/contents/${path}${query}`,
      {
        token: this.orgToken(),
        missing: "null",
      },
    );
  }

  async upsertFile(input: {
    owner: string;
    repo: string;
    path: string;
    content: string;
    message: string;
    branch: string;
  }) {
    this.requireRepoCreate();
    const existing = await this.getFile(
      input.owner,
      input.repo,
      input.path,
      input.branch,
    );
    if (decodeGithubFile(existing) === input.content) {
      return;
    }
    try {
      await this.putFile(input, existing?.sha);
    } catch (error) {
      if (!(error instanceof BadGatewayException)) {
        throw error;
      }
      const again = await this.getFile(
        input.owner,
        input.repo,
        input.path,
        input.branch,
      );
      if (decodeGithubFile(again) === input.content) {
        return;
      }
      await this.putFile(input, again?.sha);
    }
  }

  async hasBranch(owner: string, name: string, branch: string) {
    this.requireRepoCreate();
    const ref = await this.request<{ ref?: string } | null>(
      `/repos/${owner}/${name}/git/ref/heads/${encodeURIComponent(branch)}`,
      {
        token: this.orgToken(),
        missing: "null",
      },
    );
    return Boolean(ref);
  }

  async getPullChecks(
    owner: string,
    name: string,
    number: string,
  ): Promise<HomeworkChecksState> {
    this.requireRepoCreate();
    const pull = await this.request<{
      head?: { sha?: string };
    } | null>(`/repos/${owner}/${name}/pulls/${number}`, {
      token: this.orgToken(),
      missing: "null",
    });
    const sha = pull?.head?.sha;
    if (!sha) {
      return "unknown";
    }
    const payload = await this.request<{
      check_runs?: Array<{
        status?: string;
        conclusion?: string | null;
      }>;
    } | null>(`/repos/${owner}/${name}/commits/${sha}/check-runs`, {
      token: this.orgToken(),
      missing: "null",
    });
    const runs = payload?.check_runs ?? [];
    if (runs.length === 0) {
      return "pending";
    }
    if (
      runs.some((run) =>
        ["failure", "timed_out", "cancelled", "startup_failure"].includes(
          run.conclusion ?? "",
        ),
      )
    ) {
      return "failure";
    }
    if (runs.some((run) => run.status !== "completed")) {
      return "pending";
    }
    return "success";
  }

  async inviteCollaborator(input: {
    owner: string;
    repo: string;
    username: string;
  }) {
    this.requireRepoCreate();
    if (input.owner.toLowerCase() === input.username.toLowerCase()) {
      return;
    }
    try {
      await this.request(
        `/repos/${input.owner}/${input.repo}/collaborators/${input.username}`,
        {
          token: this.orgToken(),
          method: "PUT",
          body: { permission: "push" },
        },
      );
    } catch (error) {
      if (
        error instanceof BadGatewayException &&
        /already|exists|collaborator/i.test(String(error.message))
      ) {
        return;
      }
      throw error;
    }
  }

  frontendUrl() {
    return (
      this.config.get<string>("FRONTEND_URL")?.replace(/\/$/, "") ||
      this.config
        .get<string>("CORS_ORIGIN")
        ?.split(",")[0]
        ?.trim()
        .replace(/\/$/, "") ||
      "http://localhost:5173"
    );
  }

  templatesOwner() {
    return this.config.get<string>("GITHUB_TEMPLATES_OWNER")?.trim() ?? "";
  }

  private async putFile(
    input: {
      owner: string;
      repo: string;
      path: string;
      content: string;
      message: string;
      branch: string;
    },
    sha?: string,
  ) {
    await this.request(
      `/repos/${input.owner}/${input.repo}/contents/${input.path}`,
      {
        token: this.orgToken(),
        method: "PUT",
        body: {
          message: input.message,
          content: Buffer.from(input.content, "utf8").toString("base64"),
          branch: input.branch,
          ...(sha ? { sha } : {}),
        },
      },
    );
  }

  private async exchangeCode(code: string) {
    const response = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: this.clientId(),
          client_secret: this.clientSecret(),
          code,
          redirect_uri: this.callbackUrl(),
        }),
      },
    );
    const data = (await response.json()) as {
      access_token?: string;
      error?: string;
    };
    if (!response.ok || !data.access_token) {
      throw new BadGatewayException("GitHub не выдал доступ");
    }
    return data.access_token;
  }

  private async request<T>(
    path: string,
    options: {
      token: string;
      method?: string;
      body?: unknown;
      missing?: "null";
    },
  ): Promise<T> {
    const response = await fetch(`https://api.github.com${path}`, {
      method: options.method ?? "GET",
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${options.token}`,
        "X-GitHub-Api-Version": "2022-11-28",
        ...(options.body ? { "Content-Type": "application/json" } : {}),
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
    });
    if (response.status === 204) {
      return undefined as T;
    }
    if (response.status === 404 && options.missing === "null") {
      return null as T;
    }
    const data = (await response.json().catch(() => null)) as
      | { message?: string }
      | T
      | null;
    if (!response.ok) {
      const message =
        data && typeof data === "object" && "message" in data
          ? data.message
          : null;
      throw new BadGatewayException(
        this.explainGithub(message, response.status),
      );
    }
    return data as T;
  }

  private explainGithub(message: string | null | undefined, status: number) {
    if (status === 404) {
      return "Шаблон курса ещё не опубликован на GitHub";
    }
    if (
      status === 422 &&
      message?.toLowerCase().includes("name already exists")
    ) {
      return "Репозиторий с таким именем уже есть на GitHub";
    }
    if (status === 403) {
      return "Не хватает прав GitHub, чтобы создать репозиторий";
    }
    return message || "GitHub не принял запрос";
  }

  private requireOauth() {
    if (!this.oauthConfigured()) {
      throw new ServiceUnavailableException(
        "Подключение GitHub пока не настроено",
      );
    }
  }

  private requireRepoCreate() {
    if (!this.repoCreateConfigured()) {
      throw new ServiceUnavailableException(
        "Создание репозитория пока не настроено",
      );
    }
  }

  private clientId() {
    return this.config.get<string>("GITHUB_CLIENT_ID")?.trim() ?? "";
  }

  private clientSecret() {
    return this.config.get<string>("GITHUB_CLIENT_SECRET")?.trim() ?? "";
  }

  private callbackUrl() {
    return this.config.get<string>("GITHUB_CALLBACK_URL")?.trim() ?? "";
  }

  private orgToken() {
    return this.config.get<string>("GITHUB_TOKEN")?.trim() ?? "";
  }
}

function decodeGithubFile(file: GithubFile | null) {
  if (!file?.content) {
    return null;
  }
  return Buffer.from(file.content.replace(/\n/g, ""), "base64").toString(
    "utf8",
  );
}
