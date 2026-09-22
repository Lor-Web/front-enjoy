import { BadgeCheck, Check, ChevronDown, Clock, FileText } from "lucide-react";
import { Link, useParams } from "react-router";
import {
  COURSE_TECHS,
  CourseRating,
  CourseTechIcon,
  courseTechTitle,
  formatCourses,
  formatHours,
  formatLectures,
  formatPrice,
  formatSections,
  formatStudents,
  lectureCount,
  sectionMinutes,
  useCourse,
} from "@/entities/course";
import { gradeLabel } from "@/entities/user";
import { CourseRepoCta } from "@/features/connect-github";
import { routes } from "@/shared/config/routes";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { AppShell } from "@/widgets/app-shell";

const BADGE_LABEL = {
  bestseller: "Бестселлер",
  new: "Новый",
} as const;

export function CoursePage() {
  const { slug = "" } = useParams();
  const { data: course, isPending, isError } = useCourse(slug);

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
  const lectures = lectureCount(course);
  const updated = new Date(course.updatedAt).toLocaleDateString("ru-RU", {
    month: "long",
    year: "numeric",
  });

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
                {course.badge ? (
                  <Badge variant="secondary">{BADGE_LABEL[course.badge]}</Badge>
                ) : null}
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
              <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
                <CourseRating
                  value={course.rating}
                  count={course.ratingCount}
                  className="[&_span:first-child]:text-amber-400"
                />
                <span className="text-zinc-400">
                  {formatStudents(course.students)}
                </span>
              </div>
              <p className="mt-3 text-sm text-zinc-300">
                Автор: {course.instructor.name}
              </p>
              <p className="mt-1 text-sm text-zinc-400">
                Обновлён {updated} · {course.language} ·{" "}
                {gradeLabel(course.grade)}
              </p>
            </div>

            <BuyCard
              className="mt-6 lg:hidden"
              slug={course.slug}
              priceRub={course.priceRub}
              includes={course.includes}
            />

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
              <h2 className="mb-1 text-xl font-semibold">Содержание курса</h2>
              <p className="text-muted-foreground mb-4 text-sm">
                {formatSections(course.sections.length)} ·{" "}
                {formatLectures(lectures)} · {formatHours(course.hours)}
              </p>
              <div className="divide-y rounded-md border">
                {course.sections.map((section, index) => (
                  <details
                    key={section.title}
                    open={index === 0}
                    className="group"
                  >
                    <summary className="hover:bg-accent/50 flex cursor-pointer list-none items-center gap-2 px-4 py-3 text-sm font-medium [&::-webkit-details-marker]:hidden">
                      <ChevronDown className="text-muted-foreground size-4 shrink-0 transition-transform group-open:rotate-180" />
                      <span className="flex-1">{section.title}</span>
                      <span className="text-muted-foreground font-normal">
                        {section.lectures.length} ·{" "}
                        {sectionMinutes(section.lectures)} мин
                      </span>
                    </summary>
                    <ul className="border-t">
                      {section.lectures.map((lecture) => (
                        <li
                          key={lecture.title}
                          className="text-muted-foreground flex items-center gap-2 px-4 py-2.5 pl-10 text-sm"
                        >
                          <FileText className="size-3.5 shrink-0" />
                          <span className="flex-1 text-foreground">
                            {lecture.title}
                            {lecture.preview ? (
                              <span className="text-primary ml-2 text-xs">
                                обзор
                              </span>
                            ) : null}
                          </span>
                          <span className="tabular-nums">
                            {lecture.minutes} мин
                          </span>
                        </li>
                      ))}
                    </ul>
                  </details>
                ))}
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

            <section className="mt-10">
              <h2 className="mb-4 text-xl font-semibold">Автор</h2>
              <p className="text-lg font-medium">{course.instructor.name}</p>
              <p className="text-muted-foreground text-sm">
                {course.instructor.role}
              </p>
              <p className="text-muted-foreground mt-2 text-sm">
                Рейтинг {course.instructor.rating.toFixed(1)} ·{" "}
                {formatCourses(course.instructor.courses)} ·{" "}
                {formatStudents(course.instructor.students)}
              </p>
              <p className="mt-3 text-[17px] leading-7">
                {course.instructor.bio}
              </p>
            </section>

            <section className="mt-10">
              <h2 className="mb-4 text-xl font-semibold">Отзывы</h2>
              <ul className="space-y-6">
                {course.reviews.map((review) => (
                  <li key={`${review.name}-${review.date}`}>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium">{review.name}</p>
                      <CourseRating value={review.rating} />
                    </div>
                    <p className="text-muted-foreground mt-0.5 text-xs">
                      {new Date(review.date).toLocaleDateString("ru-RU")}
                    </p>
                    <p className="mt-2 text-sm leading-6">{review.text}</p>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <aside className="sticky top-20 hidden lg:block">
            <BuyCard
              slug={course.slug}
              priceRub={course.priceRub}
              includes={course.includes}
            />
          </aside>
        </div>
      </div>
    </AppShell>
  );
}

function BuyCard({
  slug,
  priceRub,
  includes,
  className,
}: {
  slug: string;
  priceRub: number;
  includes: string[];
  className?: string;
}) {
  return (
    <div className={`rounded-xl border p-5 shadow-sm ${className ?? ""}`}>
      <p className="text-3xl font-semibold tabular-nums">
        {formatPrice(priceRub)}
      </p>
      <CourseRepoCta slug={slug} />
      <p className="text-muted-foreground mt-2 text-center text-xs">
        Репозиторий создаётся из шаблона курса в GitHub-организации Front Enjoy
      </p>
      <ul className="mt-5 space-y-2">
        {includes.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm leading-5">
            {item.includes("час") ? (
              <Clock className="text-muted-foreground mt-0.5 size-4 shrink-0" />
            ) : (
              <BadgeCheck className="text-muted-foreground mt-0.5 size-4 shrink-0" />
            )}
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
