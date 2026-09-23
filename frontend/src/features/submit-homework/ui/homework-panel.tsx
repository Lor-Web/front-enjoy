import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import { type CourseHomework, HomeworkChecksStatus } from "@/entities/course";
import { useMyMentors } from "@/entities/mentorship";
import { GitHubIcon } from "@/entities/user";
import { tokenAtom, useMe } from "@/features/auth";
import {
  useCourseRepository,
  useCreateCourseRepository,
  useGithubCallbackToast,
  useGithubConnect,
} from "@/features/connect-github";
import { routes } from "@/shared/config/routes";
import { toastError } from "@/shared/lib/toast";
import { Button } from "@/shared/ui/button";
import { CodeBlock } from "@/shared/ui/code-block";
import { InlineMarkup } from "@/shared/ui/inline-markup";
import { Input } from "@/shared/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import {
  useCourseHomework,
  useSubmitCourseHomework,
} from "../model/use-homework";

type HomeworkPanelProps = {
  courseSlug: string;
  moduleSlug: string;
  branch: string;
  done: boolean;
  onPass: () => void;
};

export function HomeworkPanel({
  courseSlug,
  moduleSlug,
  branch,
  done,
  onPass,
}: HomeworkPanelProps) {
  useGithubCallbackToast();
  const location = useLocation();
  const token = useAtomValue(tokenAtom);
  const { data: me, isLoading: meLoading } = useMe();
  const signedIn = Boolean(me);
  const mentorsQuery = useMyMentors(signedIn ? token : null);
  const activeMentors = (mentorsQuery.data ?? []).filter(
    (item) => item.status === "active",
  );
  const { connect } = useGithubConnect();
  const { data: repo, isLoading: repoLoading } = useCourseRepository(
    courseSlug,
    signedIn,
  );
  const create = useCreateCourseRepository(courseSlug);
  const { data: submission, isLoading: homeworkLoading } = useCourseHomework(
    courseSlug,
    moduleSlug,
    signedIn && Boolean(repo),
  );
  const submit = useSubmitCourseHomework(courseSlug, moduleSlug);
  const [prUrl, setPrUrl] = useState("");
  const [mentorId, setMentorId] = useState("");

  useEffect(() => {
    if (submission?.prUrl) {
      setPrUrl(submission.prUrl);
    }
    if (submission?.mentorId) {
      setMentorId(submission.mentorId);
    }
    if (submission?.status === "accepted") {
      onPass();
    }
  }, [onPass, submission?.mentorId, submission?.prUrl, submission?.status]);

  useEffect(() => {
    if (!mentorId && activeMentors.length === 1 && activeMentors[0]) {
      setMentorId(activeMentors[0].mentor.id);
    }
  }, [activeMentors, mentorId]);

  if (meLoading || (signedIn && repoLoading)) {
    return (
      <section className="mb-10 rounded-xl border px-4 py-4">
        <p className="text-muted-foreground text-sm">Загрузка…</p>
      </section>
    );
  }

  if (!me?.githubLogin) {
    return (
      <section className="mb-10 rounded-xl border px-4 py-4">
        <h2 className="text-lg font-medium">Репозиторий задания</h2>
        <p className="text-muted-foreground mt-2 text-sm leading-6">
          Сначала привяжите GitHub к профилю. Платформа создаст вам публичный
          репозиторий по шаблону курса и добавит вас с правом пуша.
        </p>
        <Button
          type="button"
          className="mt-4"
          disabled={connect.isPending}
          onClick={() => connect.mutate(location.pathname)}
        >
          <GitHubIcon className="size-4" />
          Подключить GitHub
        </Button>
      </section>
    );
  }

  if (!repo) {
    return (
      <section className="mb-10 rounded-xl border px-4 py-4">
        <h2 className="text-lg font-medium">Репозиторий задания</h2>
        <p className="text-muted-foreground mt-2 text-sm leading-6">
          <InlineMarkup
            text={`GitHub подключён как ${me.githubLogin}. Создайте публичный репозиторий — в нём будете работать в ветке \`${branch}\` и откроете pull request в \`main\`.`}
          />
        </p>
        <Button
          type="button"
          className="mt-4"
          disabled={create.isPending}
          onClick={() => create.mutate()}
        >
          Создать репозиторий
        </Button>
      </section>
    );
  }

  const clone = `git clone ${repo.htmlUrl}.git
cd ${repo.name}
git checkout -b ${branch}`;

  return (
    <section className="mb-10 rounded-xl border px-4 py-4">
      <h2 className="text-lg font-medium">Репозиторий и сдача</h2>
      <p className="text-muted-foreground mt-2 text-sm leading-6">
        <InlineMarkup
          text={`Примите приглашение в GitHub, если ещё не принимали. Клонируйте репозиторий, работайте в ветке \`${branch}\`, откройте PR в \`main\` и вставьте ссылку ниже.`}
        />
      </p>
      <p className="mt-3 text-sm">
        <a
          href={repo.htmlUrl}
          className="text-primary font-medium underline-offset-4 hover:underline"
          target="_blank"
          rel="noreferrer"
        >
          Открыть репозиторий
        </a>
      </p>
      <div className="mt-4">
        <CodeBlock data-language="bash">
          <code>{clone}</code>
        </CodeBlock>
      </div>
      {homeworkLoading ? (
        <p className="text-muted-foreground text-sm">Загрузка сдачи…</p>
      ) : (
        <form
          className="space-y-3"
          onSubmit={(event) => {
            event.preventDefault();
            const value = prUrl.trim();
            if (!looksLikePullUrl(value)) {
              toastError(
                "Вставьте ссылку на pull request: github.com/владелец/репо/pull/номер",
              );
              return;
            }
            if (activeMentors.length > 0 && !mentorId) {
              toastError("Выберите ментора");
              return;
            }
            submit.mutate({
              prUrl: value,
              mentorId: mentorId || undefined,
            });
          }}
        >
          <label className="block text-sm font-medium" htmlFor="homework-pr">
            Ссылка на pull request
          </label>
          <Input
            id="homework-pr"
            type="url"
            inputMode="url"
            placeholder={`${repo.htmlUrl}/pull/1`}
            value={prUrl}
            onChange={(event) => setPrUrl(event.target.value)}
          />
          {activeMentors.length === 0 ? (
            <p className="text-muted-foreground text-sm leading-6">
              Активного ментора нет — работу примем, когда пройдут тесты на pull
              request. Можно{" "}
              <Link
                to={routes.mentors}
                className="text-primary underline-offset-4 hover:underline"
              >
                найти ментора
              </Link>
              .
            </p>
          ) : (
            <Select value={mentorId || undefined} onValueChange={setMentorId}>
              <SelectTrigger
                className="sm:max-w-xs"
                aria-label="Ментор для сдачи"
              >
                <SelectValue placeholder="Кому отправить" />
              </SelectTrigger>
              <SelectContent>
                {activeMentors.map((item) => (
                  <SelectItem key={item.id} value={item.mentor.id}>
                    {item.mentor.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {submission?.status === "accepted" ? null : (
            <Button
              type="submit"
              disabled={
                submit.isPending ||
                !prUrl.trim() ||
                !looksLikePullUrl(prUrl.trim()) ||
                (activeMentors.length > 0 && !mentorId)
              }
            >
              {submission ? "Обновить сдачу" : "Сдать работу"}
            </Button>
          )}
          {submission ? <HomeworkStatus submission={submission} /> : null}
          {!submission && done ? (
            <p className="text-muted-foreground text-sm">
              Раздел отмечен пройденным. Пришлите ссылку на PR, чтобы сдача
              сохранилась на сервере.
            </p>
          ) : null}
        </form>
      )}
    </section>
  );
}

function HomeworkStatus({ submission }: { submission: CourseHomework }) {
  return (
    <div className="space-y-2 text-sm leading-6">
      <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <HomeworkChecksStatus checks={submission.checks} />
        <a
          href={submission.prUrl}
          className="text-primary underline-offset-4 hover:underline"
          target="_blank"
          rel="noreferrer"
        >
          {submission.prUrl}
        </a>
      </p>
      {submission.status === "accepted" ? (
        <p className="text-emerald-800 dark:text-emerald-200/90">
          Домашняя работа принята
          {submission.mentorName ? (
            <>
              {" · "}
              <MentorName
                name={submission.mentorName}
                slug={submission.mentorSlug}
              />
            </>
          ) : null}
          .
        </p>
      ) : null}
      {submission.status === "rejected" ? (
        <p>
          В работе есть ошибки, посмотрите комментарии в вашем PR
          {submission.mentorName ? (
            <>
              {" · "}
              <MentorName
                name={submission.mentorName}
                slug={submission.mentorSlug}
              />
            </>
          ) : null}
          .
        </p>
      ) : null}
      {submission.status === "pending" && submission.mentorId ? (
        <p>
          Работа на проверке
          {submission.mentorName ? (
            <>
              {" у "}
              <MentorName
                name={submission.mentorName}
                slug={submission.mentorSlug}
              />
            </>
          ) : null}
          .
        </p>
      ) : null}
      {submission.status === "pending" && !submission.mentorId ? (
        <p className="text-muted-foreground">
          {submission.checks === "success"
            ? "Тесты пройдены, раздел сейчас откроется."
            : "Без ментора работу примем, когда тесты на pull request станут зелёными."}
        </p>
      ) : null}
    </div>
  );
}

function MentorName({ name, slug }: { name: string; slug: string | null }) {
  if (!slug) {
    return name;
  }
  return (
    <Link
      to={routes.profile(slug)}
      className="text-primary underline-offset-4 hover:underline"
    >
      {name}
    </Link>
  );
}

function looksLikePullUrl(value: string) {
  try {
    const url = new URL(value.trim());
    const host = url.hostname.toLowerCase();
    return (
      url.protocol === "https:" &&
      (host === "github.com" || host === "www.github.com") &&
      /^\/[^/]+\/[^/]+\/pull\/\d+\/?$/.test(url.pathname)
    );
  } catch {
    return false;
  }
}
