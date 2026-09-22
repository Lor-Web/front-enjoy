import { Link } from "react-router";
import { useLessons } from "@/entities/lesson";
import {
  isLessonRead,
  isQuizPassed,
  trackProgressPercent,
  useProgress,
} from "@/entities/progress";
import { routes } from "@/shared/config/routes";
import { useDocVersion } from "@/shared/lib/doc-version";
import { Badge } from "@/shared/ui/badge";
import { Progress } from "@/shared/ui/progress";
import { AppShell } from "@/widgets/app-shell";
import { LessonSidebar } from "@/widgets/lesson-sidebar";

export function CatalogPage() {
  const { data: lessons = [] } = useLessons();
  const version = useDocVersion();
  const { progress, isSignedIn } = useProgress();
  const percent = trackProgressPercent(
    progress,
    lessons.map((lesson) => lesson.slug),
  );

  return (
    <AppShell sidebar={<LessonSidebar />}>
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-3 text-3xl sm:text-4xl">Трек React</h1>
        <p className="text-muted-foreground mb-6 text-[17px] leading-7">
          Меню кафе «Зёрнышко»: установка, компоненты, JSX, пропсы, условия,
          списки, события и состояние. После каждого урока — мини-квиз.
        </p>
        {isSignedIn ? (
          <>
            <Progress value={percent} className="mb-2" />
            <p className="text-muted-foreground mb-8 text-sm">
              {percent}% пройдено
            </p>
          </>
        ) : (
          <p className="text-muted-foreground mb-8 text-sm">
            <Link
              to={routes.login}
              state={{ from: routes.catalog }}
              className="text-primary underline-offset-4 hover:underline"
            >
              {"Войдите"}
            </Link>
            {", чтобы сохранять прогресс по урокам."}
          </p>
        )}

        <ol className="divide-y border-y">
          {lessons.map((lesson) => {
            const read = isSignedIn && isLessonRead(progress, lesson.slug);
            const passed =
              isSignedIn && isQuizPassed(progress, lesson.quizSlug);
            return (
              <li key={lesson.slug}>
                <Link
                  to={routes.lesson(lesson.slug, { version })}
                  className="hover:bg-accent/60 -mx-3 flex flex-col gap-2 rounded-md px-3 py-4 transition-colors sm:flex-row sm:items-baseline sm:justify-between"
                >
                  <span>
                    <span className="text-muted-foreground mr-3 font-mono text-sm">
                      {String(lesson.order).padStart(2, "0")}
                    </span>
                    <span className="text-[17px]">{lesson.title}</span>
                  </span>
                  <span className="flex gap-2">
                    {read ? <Badge variant="outline">Прочитано</Badge> : null}
                    {passed ? <Badge variant="success">Квиз сдан</Badge> : null}
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      </div>
    </AppShell>
  );
}
