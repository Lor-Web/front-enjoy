import { useAtomValue } from "jotai";
import { Link, useParams } from "react-router";
import { useLessons } from "@/entities/lesson";
import { useStudentMentorship } from "@/entities/mentorship";
import { courseProgressPercent } from "@/entities/progress";
import { tokenAtom } from "@/features/auth";
import { RateUserForm } from "@/features/rate-user";
import { routes } from "@/shared/config/routes";
import { formatRuDate } from "@/shared/lib/format-date";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Progress } from "@/shared/ui/progress";
import { AppShell } from "@/widgets/app-shell";

export function StudentProgressPage() {
  const { id = "" } = useParams();
  const token = useAtomValue(tokenAtom);
  const { data: lessons = [] } = useLessons();
  const { data, isPending, isError } = useStudentMentorship(token, id);

  if (isPending) {
    return (
      <AppShell>
        <p className="text-muted-foreground">Загрузка…</p>
      </AppShell>
    );
  }

  if (isError || !data) {
    return (
      <AppShell>
        <p>Не удалось открыть прогресс ученика.</p>
        <Button asChild variant="link" className="px-0">
          <Link to={routes.cabinet}>К кабинету</Link>
        </Button>
      </AppShell>
    );
  }

  const readLessonIds = data.progress.reads.map((item) => item.slug);
  const passedQuizIds = data.progress.quizzes
    .filter((item) => item.passed)
    .map((item) => item.slug);
  const percent = courseProgressPercent(
    { readLessonIds, passedQuizIds },
    lessons.map((lesson) => ({ slug: lesson.slug, quizSlug: lesson.quizSlug })),
  );
  const readCount = lessons.filter((lesson) =>
    readLessonIds.includes(lesson.slug),
  ).length;
  const quizCount = lessons.filter((lesson) =>
    passedQuizIds.includes(lesson.quizSlug),
  ).length;

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl">
        <p className="text-muted-foreground mb-4 text-sm">
          <Link to={routes.cabinet} className="text-primary hover:underline">
            Кабинет
          </Link>
        </p>
        <h1 className="mb-2 text-3xl sm:text-4xl">{data.student.name}</h1>
        <p className="text-muted-foreground mb-6 text-[17px] leading-7">
          Трек React
        </p>
        <Progress value={percent} className="mb-2" />
        <p className="text-muted-foreground mb-8 text-sm">
          {percent}% курса · документация {readCount} из {lessons.length} ·
          квизы {quizCount} из {lessons.length}
        </p>

        <ol className="divide-y border-y">
          {lessons.map((lesson) => {
            const read = data.progress.reads.find(
              (item) => item.slug === lesson.slug,
            );
            const quiz = data.progress.quizzes.find(
              (item) => item.slug === lesson.quizSlug,
            );
            return (
              <li key={lesson.slug} className="py-4">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <Link
                    to={routes.lesson(lesson.slug)}
                    className="text-[17px] hover:underline"
                  >
                    {lesson.title}
                  </Link>
                  <span className="flex gap-2">
                    {read ? <Badge variant="outline">Прочитано</Badge> : null}
                    {quiz?.passed ? (
                      <Badge variant="success">Квиз сдан</Badge>
                    ) : null}
                  </span>
                </div>
                <ul className="text-muted-foreground mt-2 space-y-1 text-sm">
                  <li>
                    {read ? (
                      <>Тема прочитана {formatRuDate(read.readAt)}</>
                    ) : (
                      <>Тема ещё не прочитана</>
                    )}
                  </li>
                  <li>
                    {quiz?.passed && quiz.passedAt ? (
                      <>
                        Квиз сдан {formatRuDate(quiz.passedAt)}
                        {quiz.attempts > 1 ? ` · попыток ${quiz.attempts}` : ""}
                        {" · "}
                        <Link
                          to={routes.quiz(lesson.quizSlug)}
                          className="text-primary hover:underline"
                        >
                          открыть квиз
                        </Link>
                      </>
                    ) : quiz && quiz.attempts > 0 ? (
                      <>
                        Квиз не сдан, попыток {quiz.attempts}
                        {" · "}
                        <Link
                          to={routes.quiz(lesson.quizSlug)}
                          className="text-primary hover:underline"
                        >
                          открыть квиз
                        </Link>
                      </>
                    ) : (
                      <>
                        Квиз ещё не сдавали
                        {" · "}
                        <Link
                          to={routes.quiz(lesson.quizSlug)}
                          className="text-primary hover:underline"
                        >
                          открыть квиз
                        </Link>
                      </>
                    )}
                  </li>
                </ul>
              </li>
            );
          })}
        </ol>

        {data.status === "active" || data.status === "ended" ? (
          <div className="mt-10">
            <RateUserForm mentorship={data} aspect="asStudent" />
          </div>
        ) : null}
      </div>
    </AppShell>
  );
}
