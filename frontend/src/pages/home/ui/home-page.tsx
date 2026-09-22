import { Link } from "react-router";
import { useLessons } from "@/entities/lesson";
import { trackProgressPercent, useProgress } from "@/entities/progress";
import { routes } from "@/shared/config/routes";
import { TRACK_TITLE } from "@/shared/config/tracks";
import { Button } from "@/shared/ui/button";
import { Progress } from "@/shared/ui/progress";
import { AppShell } from "@/widgets/app-shell";

export function HomePage() {
  const { data: lessons = [] } = useLessons();
  const { progress, isSignedIn } = useProgress();
  const percent = trackProgressPercent(
    progress,
    lessons.map((lesson) => lesson.slug),
  );
  const first = lessons[0];

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl py-6 sm:py-12">
        <p className="text-muted-foreground mb-4 text-sm">
          Платформа для изучения фронтенда
        </p>
        <h1 className="mb-5 text-4xl leading-tight sm:text-5xl">Front Enjoy</h1>
        <p className="text-muted-foreground mb-8 text-[17px] leading-7">
          Короткие текстовые уроки и мини-квизы. Сейчас открыт трек React: от
          установки и первого компонента до общего состояния — на примере меню
          кафе. Читать можно без аккаунта; вход сохраняет прогресс и открывает
          менторство.
        </p>
        <div className="flex flex-wrap gap-3">
          {first ? (
            <Button asChild>
              <Link to={routes.lesson(first.slug)}>Начать с первого урока</Link>
            </Button>
          ) : null}
          <Button asChild variant="outline">
            <Link to={routes.catalog}>Каталог трека</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link to={routes.users}>Пользователи</Link>
          </Button>
        </div>

        <section className="mt-14 border-t pt-8">
          <h2 className="mb-2 text-xl">Трек {TRACK_TITLE}</h2>
          <p className="text-muted-foreground mb-4 text-sm">
            {lessons.length}{" "}
            {lessons.length === 1
              ? "урок"
              : lessons.length < 5
                ? "урока"
                : "уроков"}{" "}
            · опора на документацию react.dev
          </p>
          {isSignedIn ? (
            <>
              <Progress value={percent} className="mb-2" />
              <p className="text-muted-foreground text-sm">
                {percent}% пройдено
              </p>
            </>
          ) : (
            <p className="text-muted-foreground text-sm">
              <Link
                to={routes.login}
                state={{ from: routes.home }}
                className="text-primary underline-offset-4 hover:underline"
              >
                {"Войдите"}
              </Link>
              {", чтобы сохранять отметки «прочитано» и сдачу квизов."}
            </p>
          )}
        </section>
      </div>
    </AppShell>
  );
}
