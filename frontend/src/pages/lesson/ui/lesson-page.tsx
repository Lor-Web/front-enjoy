import { useEffect, useLayoutEffect } from "react";
import { Link, useLocation, useParams } from "react-router";
import { getNeighborLessons, useLesson } from "@/entities/lesson";
import { useCompleteLesson } from "@/features/complete-lesson";
import { useLessonView } from "@/features/select-lesson-view";
import { routes } from "@/shared/config/routes";
import { scrollToHash } from "@/shared/lib/scroll-to-hash";
import { Button } from "@/shared/ui/button";
import { AppShell } from "@/widgets/app-shell";
import { LessonArticle } from "@/widgets/lesson-article";
import { LessonSidebar } from "@/widgets/lesson-sidebar";

export function LessonPage() {
  const { slug = "" } = useParams();
  const location = useLocation();
  const { data: lesson, isError, isPending } = useLesson(slug);
  const completeLesson = useCompleteLesson();
  const [view] = useLessonView();

  useEffect(() => {
    if (lesson) {
      completeLesson(lesson.slug);
    }
  }, [completeLesson, lesson]);

  useLayoutEffect(() => {
    void view;
    if (!lesson || !location.hash) {
      return;
    }
    if (scrollToHash(location.hash)) {
      return;
    }
    const frame = window.requestAnimationFrame(() => {
      scrollToHash(location.hash);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [lesson, location.hash, view]);

  if (isPending) {
    return (
      <AppShell sidebar={<LessonSidebar />}>
        <p className="text-muted-foreground">Загрузка…</p>
      </AppShell>
    );
  }

  if (isError || !lesson) {
    return (
      <AppShell sidebar={<LessonSidebar />}>
        <p>Урок не найден.</p>
        <Button asChild variant="link" className="px-0">
          <Link to={routes.catalog}>К каталогу</Link>
        </Button>
      </AppShell>
    );
  }

  const { prev, next } = getNeighborLessons(lesson.slug);

  return (
    <AppShell
      sidebar={<LessonSidebar />}
      footer={
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          {prev ? (
            <Button asChild variant="ghost" className="justify-start">
              <Link to={lessonHref(prev.slug)}>← {prev.title}</Link>
            </Button>
          ) : (
            <span />
          )}
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button asChild variant="outline">
              <Link to={routes.quiz(lesson.slug)}>Мини-квиз</Link>
            </Button>
            {next ? (
              <Button asChild>
                <Link to={lessonHref(next.slug)}>Дальше</Link>
              </Button>
            ) : null}
          </div>
        </div>
      }
    >
      <LessonArticle lesson={lesson} view={view} />
    </AppShell>
  );
}

function lessonHref(slug: string) {
  return { pathname: routes.lesson(slug), hash: "" };
}
