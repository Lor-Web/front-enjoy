import { useAtomValue } from "jotai";
import { Check, ChevronDown, Lock } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router";
import {
  COURSE_TECHS,
  type Course,
  CourseTechIcon,
  completedCount,
  courseTechTitle,
  firstSection,
  formatModules,
  formatProgress,
  formatSections,
  isModuleUnlocked,
  isSectionUnlocked,
  nextIncompleteSection,
  progressPercent,
  sectionCount,
  useCourse,
  useCourseProgress,
} from "@/entities/course";
import { gradeLabel } from "@/entities/user";
import { tokenAtom } from "@/features/auth";
import { routes } from "@/shared/config/routes";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Progress } from "@/shared/ui/progress";
import { AppShell } from "@/widgets/app-shell";

export function CoursePage() {
  const { slug = "" } = useParams();
  const token = useAtomValue(tokenAtom);
  const { data: course, isPending, isError } = useCourse(slug);
  const { completed, isDone, started } = useCourseProgress(slug);

  if (isPending) {
    return (
      <AppShell>
        <p className="text-muted-foreground">Загрузка…</p>
      </AppShell>
    );
  }

  if (isError || !course) {
    return (
      <AppShell>
        <h1 className="mb-3 text-3xl">Курс не найден</h1>
        <p className="text-muted-foreground mb-6">
          Проверьте адрес или вернитесь в каталог.
        </p>
        <Button asChild>
          <Link to={routes.courses}>К курсам</Link>
        </Button>
      </AppShell>
    );
  }

  const tech = COURSE_TECHS.find((item) => item.id === course.tech);

  return (
    <AppShell>
      <div className="mx-auto max-w-5xl">
        <p className="text-muted-foreground mb-4 text-sm">
          <Link to={routes.courses} className="hover:text-foreground">
            Курсы
          </Link>
          <span className="mx-2">/</span>
          <Link
            to={`${routes.courses}?tech=${course.tech}`}
            className="hover:text-foreground"
          >
            {courseTechTitle(course.tech)}
          </Link>
        </p>

        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start lg:gap-10">
          <div>
            <div className="bg-zinc-950 text-zinc-50 -mx-4 px-4 py-8 sm:-mx-6 sm:px-6 lg:mx-0 lg:rounded-xl lg:px-8">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className="inline-flex items-center gap-1.5 text-sm"
                  style={{ color: tech?.hex }}
                >
                  <CourseTechIcon id={course.tech} className="size-4" />
                  {courseTechTitle(course.tech)}
                </span>
                {course.publisher === "platform" ? (
                  <Badge variant="secondary">Front Enjoy</Badge>
                ) : null}
              </div>
              <h1 className="mt-3 font-serif text-3xl leading-tight sm:text-4xl">
                {course.title}
              </h1>
              <p className="mt-3 text-[17px] leading-7 text-zinc-300">
                {course.subtitle}
              </p>
              <p className="mt-3 text-sm text-zinc-300">
                Автор: {course.authorName}
              </p>
              <p className="mt-1 text-sm text-zinc-400">
                {course.language} · {gradeLabel(course.grade)} ·{" "}
                {formatModules(course.modules.length)} ·{" "}
                {formatSections(sectionCount(course))}
              </p>
            </div>

            <StartCard className="mt-6 lg:hidden" course={course} />

            <section className="mt-10">
              <h2 className="mb-4 text-xl font-semibold">Чему вы научитесь</h2>
              <ul className="grid gap-3 sm:grid-cols-2">
                {course.learnings.map((item) => (
                  <li key={item} className="flex gap-2 text-sm leading-6">
                    <Check className="text-primary mt-0.5 size-4 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section className="mt-10">
              <h2 className="mb-1 text-xl font-semibold">Программа</h2>
              <p className="text-muted-foreground mb-4 text-sm">
                Урок открывается после предыдущего. Модуль — после предыдущего
                модуля. В конце урока может быть квиз, задача или ничего.
              </p>
              <div className="divide-y rounded-md border">
                {course.modules.map((module) => {
                  const moduleOpen = isModuleUnlocked(
                    course,
                    module.slug,
                    completed,
                  );
                  return (
                    <details
                      key={module.slug}
                      open={moduleOpen}
                      className="group"
                    >
                      <summary className="hover:bg-accent/50 flex cursor-pointer list-none items-center gap-2 px-4 py-3 text-sm font-medium [&::-webkit-details-marker]:hidden">
                        {moduleOpen ? (
                          <ChevronDown className="text-muted-foreground size-4 shrink-0 transition-transform group-open:rotate-180" />
                        ) : (
                          <Lock className="text-muted-foreground size-4 shrink-0" />
                        )}
                        <span className="flex-1">{module.title}</span>
                        <span className="text-muted-foreground font-normal">
                          {formatSections(module.sections.length)}
                        </span>
                      </summary>
                      <p className="text-muted-foreground border-t px-4 py-2 pl-10 text-sm leading-6">
                        {module.summary}
                      </p>
                      {module.sections.length === 0 ? (
                        <p className="text-muted-foreground px-4 pb-3 pl-10 text-sm">
                          Уроки появятся, когда закроете предыдущий модуль и мы
                          их опубликуем.
                        </p>
                      ) : (
                        <ul className="border-t">
                          {module.sections.map((section) => {
                            const open = isSectionUnlocked(
                              course,
                              module.slug,
                              section.slug,
                              completed,
                            );
                            const done = isDone(module.slug, section.slug);
                            const row = (
                              <>
                                {done ? (
                                  <Check className="text-primary size-3.5 shrink-0" />
                                ) : open ? null : (
                                  <Lock className="size-3.5 shrink-0" />
                                )}
                                <span className="flex-1 text-foreground">
                                  {section.title}
                                </span>
                              </>
                            );
                            return (
                              <li key={section.slug}>
                                {open && started && token ? (
                                  <Link
                                    to={routes.courseSection(
                                      course.slug,
                                      module.slug,
                                      section.slug,
                                    )}
                                    className="hover:bg-accent/40 text-muted-foreground flex items-center gap-2 px-4 py-2.5 pl-10 text-sm"
                                  >
                                    {row}
                                  </Link>
                                ) : (
                                  <p className="text-muted-foreground flex items-center gap-2 px-4 py-2.5 pl-10 text-sm">
                                    {row}
                                  </p>
                                )}
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </details>
                  );
                })}
              </div>
            </section>

            <section className="mt-10">
              <h2 className="mb-4 text-xl font-semibold">Требования</h2>
              <ul className="list-disc space-y-1 pl-5 text-sm leading-6">
                {course.requirements.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            <section className="mt-10">
              <h2 className="mb-4 text-xl font-semibold">Описание</h2>
              {course.description.map((paragraph) => (
                <p
                  key={paragraph}
                  className="mb-4 text-[17px] leading-7 last:mb-0"
                >
                  {paragraph}
                </p>
              ))}
            </section>
          </div>

          <aside className="sticky top-20 hidden lg:block">
            <StartCard course={course} />
          </aside>
        </div>
      </div>
    </AppShell>
  );
}

function StartCard({
  course,
  className,
}: {
  course: Course;
  className?: string;
}) {
  const token = useAtomValue(tokenAtom);
  const navigate = useNavigate();
  const { completed, started, start } = useCourseProgress(course.slug);
  const first = firstSection(course);
  const next = nextIncompleteSection(course, completed);
  const total = sectionCount(course);
  const done = completedCount(course, completed);
  const firstHref = first
    ? routes.courseSection(course.slug, first.module.slug, first.section.slug)
    : null;
  const continueHref = next
    ? routes.courseSection(course.slug, next.module.slug, next.section.slug)
    : null;

  return (
    <div className={`rounded-xl border p-5 shadow-sm ${className ?? ""}`}>
      {token && started && total > 0 ? (
        <div className="mb-4 space-y-2">
          <p className="text-sm font-medium">{formatProgress(done, total)}</p>
          <Progress value={progressPercent(course, completed)} />
        </div>
      ) : null}
      {!token ? (
        firstHref ? (
          <Button asChild className="w-full">
            <Link to={routes.login} state={{ from: firstHref }}>
              Войти, чтобы начать
            </Link>
          </Button>
        ) : (
          <p className="text-muted-foreground text-center text-sm">
            Уроки ещё не опубликованы.
          </p>
        )
      ) : !started ? (
        <Button
          className="w-full"
          disabled={!firstHref}
          onClick={() => {
            if (!firstHref) {
              return;
            }
            start();
            navigate(firstHref);
          }}
        >
          Начать курс
        </Button>
      ) : continueHref ? (
        <Button asChild className="w-full">
          <Link to={continueHref}>Продолжить</Link>
        </Button>
      ) : (
        <p className="text-muted-foreground text-center text-sm">
          Открытые уроки пройдены. Следующий модуль ещё закрыт.
        </p>
      )}
    </div>
  );
}
