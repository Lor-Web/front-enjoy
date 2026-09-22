import { Link, useParams } from "react-router";
import { getNeighborLessons, useLesson } from "@/entities/lesson";
import { useQuiz } from "@/entities/quiz";
import { ContentRating, quizVoteKey } from "@/features/rate-content";
import { QuizForm } from "@/features/submit-quiz";
import { routes } from "@/shared/config/routes";
import { useDocVersion } from "@/shared/lib/doc-version";
import { Button } from "@/shared/ui/button";
import { EstimatedTime } from "@/shared/ui/estimated-time";
import { AppShell } from "@/widgets/app-shell";
import { LessonSidebar } from "@/widgets/lesson-sidebar";

export function QuizPage() {
  const { slug = "" } = useParams();
  const version = useDocVersion();
  const { data: lesson } = useLesson(slug);
  const quizSlug = lesson?.quizSlug ?? slug;
  const { data: quiz, isError, isPending } = useQuiz(quizSlug);
  const next = lesson ? getNeighborLessons(lesson.slug).next : undefined;

  if (isPending) {
    return (
      <AppShell sidebar={<LessonSidebar />}>
        <p className="text-muted-foreground">Загрузка…</p>
      </AppShell>
    );
  }

  if (isError || !quiz) {
    return (
      <AppShell sidebar={<LessonSidebar />}>
        <p>Квиз не найден.</p>
        <Button asChild variant="link" className="px-0">
          <Link to={routes.toCatalog(version)}>К каталогу</Link>
        </Button>
      </AppShell>
    );
  }

  return (
    <AppShell
      sidebar={<LessonSidebar />}
      footer={
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          {lesson ? (
            <Button asChild variant="ghost" className="justify-start">
              <Link to={routes.toLesson(lesson.slug, { version })}>
                ← {lesson.title}
              </Link>
            </Button>
          ) : (
            <span />
          )}
          {next ? (
            <Button asChild>
              <Link to={routes.toLesson(next.slug, { version })}>
                Следующий урок
              </Link>
            </Button>
          ) : (
            <Button asChild variant="outline">
              <Link to={routes.toCatalog(version)}>К каталогу</Link>
            </Button>
          )}
        </div>
      }
    >
      <div className="mx-auto max-w-2xl">
        <EstimatedTime minutes={quiz.readingMinutes} purpose="solving" />
        <h1 className="mb-2 text-3xl sm:text-4xl">{quiz.title}</h1>
        <p className="text-muted-foreground mb-8 text-[17px] leading-7">
          Один верный вариант в каждом вопросе. После проверки появится
          пояснение.
        </p>
        <QuizForm quiz={quiz} />
        <ContentRating targetId={quizVoteKey(quiz.slug)} />
      </div>
    </AppShell>
  );
}
