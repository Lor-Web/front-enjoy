import { CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router";
import {
  type CourseBlock,
  type CourseSection,
  type CourseWork,
  estimateCourseSectionMinutes,
  findModule,
  findSection,
  isSectionUnlocked,
  neighborSections,
  sectionKey,
  useCourse,
  useCourseProgress,
} from "@/entities/course";
import { HomeworkPanel } from "@/features/submit-homework";
import { routes } from "@/shared/config/routes";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { Checkbox } from "@/shared/ui/checkbox";
import { CodeBlock } from "@/shared/ui/code-block";
import { EstimatedTime } from "@/shared/ui/estimated-time";
import { InlineMarkup } from "@/shared/ui/inline-markup";
import { RadioGroup, RadioGroupItem } from "@/shared/ui/radio-group";
import { AppShell } from "@/widgets/app-shell";
import { CourseSidebar } from "@/widgets/course-sidebar";

export function CourseSectionPage() {
  const { slug = "", moduleSlug = "", sectionSlug = "" } = useParams();
  const { data: course, isPending, isError } = useCourse(slug);
  const { completed, started, isDone, quizAnswers, complete, start } =
    useCourseProgress(slug);

  useEffect(() => {
    if (course) {
      start();
    }
  }, [course, start]);

  const module = course ? findModule(course, moduleSlug) : null;
  const section = module ? findSection(module, sectionSlug) : null;
  const done = module && section ? isDone(module.slug, section.slug) : false;

  useEffect(() => {
    if (module && section && !section.work && !done) {
      complete(module.slug, section.slug);
    }
  }, [complete, done, module, section]);

  if (isPending) {
    return (
      <AppShell navTitle="Курс" navDescription="Оглавление">
        <p className="text-muted-foreground">Загрузка…</p>
      </AppShell>
    );
  }

  if (isError || !course) {
    return (
      <AppShell navTitle="Курс" navDescription="Оглавление">
        <p>Курс не найден.</p>
        <Button asChild variant="link" className="px-0">
          <Link to={routes.courses}>К курсам</Link>
        </Button>
      </AppShell>
    );
  }

  const sidebar = (
    <CourseSidebar course={course} completed={completed} started={started} />
  );

  if (!module || !section) {
    return (
      <AppShell sidebar={sidebar} navTitle="Курс" navDescription={course.title}>
        <p>Урок не найден.</p>
        <Button asChild variant="link" className="px-0">
          <Link to={routes.course(course.slug)}>К курсу</Link>
        </Button>
      </AppShell>
    );
  }

  const unlocked = isSectionUnlocked(
    course,
    module.slug,
    section.slug,
    completed,
  );
  if (!unlocked) {
    return <Navigate to={routes.course(course.slug)} replace />;
  }

  const neighbors = neighborSections(course, module.slug, section.slug);
  const nextOpen =
    done &&
    neighbors.next &&
    isSectionUnlocked(
      course,
      neighbors.next.module.slug,
      neighbors.next.section.slug,
      new Set([...completed, `${module.slug}/${section.slug}`]),
    );

  return (
    <AppShell
      sidebar={sidebar}
      navTitle="Курс"
      navDescription={course.title}
      footer={
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          {neighbors.prev ? (
            <Button asChild variant="ghost" className="justify-start">
              <Link
                to={routes.courseSection(
                  course.slug,
                  neighbors.prev.module.slug,
                  neighbors.prev.section.slug,
                )}
              >
                ← {neighbors.prev.section.title}
              </Link>
            </Button>
          ) : (
            <Button asChild variant="ghost" className="justify-start">
              <Link to={routes.course(course.slug)}>← К курсу</Link>
            </Button>
          )}
          {nextOpen && neighbors.next ? (
            <Button asChild>
              <Link
                to={routes.courseSection(
                  course.slug,
                  neighbors.next.module.slug,
                  neighbors.next.section.slug,
                )}
              >
                Дальше
              </Link>
            </Button>
          ) : done ? (
            <Button asChild variant="outline">
              <Link to={routes.course(course.slug)}>К программе</Link>
            </Button>
          ) : (
            <span />
          )}
        </div>
      }
    >
      <LessonArticle
        courseSlug={course.slug}
        moduleSlug={module.slug}
        moduleTitle={module.title}
        section={section}
        done={done}
        savedAnswers={quizAnswers(module.slug, section.slug)}
        onPass={(answers) => complete(module.slug, section.slug, answers)}
      />
    </AppShell>
  );
}

function LessonArticle({
  courseSlug,
  moduleSlug,
  moduleTitle,
  section,
  done,
  savedAnswers,
  onPass,
}: {
  courseSlug: string;
  moduleSlug: string;
  moduleTitle: string;
  section: CourseSection;
  done: boolean;
  savedAnswers: number[] | null;
  onPass: (answers?: number[]) => void;
}) {
  const homework = section.work?.type === "homework" ? section.work : null;

  return (
    <article className="mx-auto max-w-2xl">
      <p className="text-muted-foreground mb-3 text-sm">{moduleTitle}</p>
      <EstimatedTime
        minutes={estimateCourseSectionMinutes(section)}
        purpose={homework ? "solving" : "reading"}
      />
      <h1 className="mb-6 text-3xl sm:text-4xl">{section.title}</h1>
      {homework ? (
        <HomeworkPanel
          courseSlug={courseSlug}
          moduleSlug={moduleSlug}
          branch={homework.branch}
          done={done}
          onPass={onPass}
        />
      ) : null}
      {section.body.map((block) => (
        <CourseBlockView key={blockKey(block)} block={block} />
      ))}
      {homework ? (
        done ? (
          <div className="mt-10">
            <PassedBanner />
          </div>
        ) : null
      ) : section.work ? (
        <div className="mt-10 border-t pt-8">
          <SectionWork
            key={sectionKey("work", section.slug)}
            work={section.work}
            done={done}
            savedAnswers={savedAnswers}
            onPass={onPass}
          />
        </div>
      ) : done ? (
        <div className="mt-10">
          <PassedBanner />
        </div>
      ) : null}
    </article>
  );
}

function blockKey(block: CourseBlock) {
  if (block.type === "ul") {
    return `ul:${block.items[0] ?? ""}`;
  }
  if (block.type === "code") {
    return `code:${block.text.slice(0, 48)}`;
  }
  return `${block.type}:${block.text.slice(0, 48)}`;
}

function CourseBlockView({ block }: { block: CourseBlock }) {
  if (block.type === "h2") {
    return (
      <h2 className="mt-8 mb-3 text-xl font-semibold">
        <InlineMarkup text={block.text} />
      </h2>
    );
  }
  if (block.type === "ul") {
    return (
      <ul className="mb-4 list-disc space-y-2 pl-5 text-[17px] leading-7">
        {block.items.map((item) => (
          <li key={item}>
            <InlineMarkup text={item} />
          </li>
        ))}
      </ul>
    );
  }
  if (block.type === "code") {
    return (
      <CodeBlock data-language={block.lang}>
        <code>{block.text}</code>
      </CodeBlock>
    );
  }
  return (
    <p className="mb-4 text-[17px] leading-7">
      <InlineMarkup text={block.text} />
    </p>
  );
}

function SectionWork({
  work,
  done,
  savedAnswers,
  onPass,
}: {
  work: CourseWork;
  done: boolean;
  savedAnswers: number[] | null;
  onPass: (answers?: number[]) => void;
}) {
  if (work.type === "quiz") {
    return (
      <QuizWork
        work={work}
        done={done}
        savedAnswers={savedAnswers}
        onPass={onPass}
      />
    );
  }
  if (work.type === "task") {
    return <TaskWork work={work} done={done} onPass={onPass} />;
  }
  return null;
}

function QuizWork({
  work,
  done,
  savedAnswers,
  onPass,
}: {
  work: Extract<CourseWork, { type: "quiz" }>;
  done: boolean;
  savedAnswers: number[] | null;
  onPass: (answers?: number[]) => void;
}) {
  const [picked, setPicked] = useState<Array<number | null>>(() => {
    if (savedAnswers && savedAnswers.length === work.questions.length) {
      return savedAnswers;
    }
    if (done) {
      return work.questions.map((question) => question.answer);
    }
    return work.questions.map(() => null);
  });
  const [checked, setChecked] = useState(done);

  const allAnswered = picked.every((item) => item !== null);
  const passed =
    done ||
    (checked &&
      picked.every((item, index) => item === work.questions[index]?.answer));

  return (
    <form
      className="space-y-6"
      onSubmit={(event) => {
        event.preventDefault();
        setChecked(true);
        const answers = picked.map((item) => item ?? -1);
        const ok = work.questions.every(
          (question, index) => answers[index] === question.answer,
        );
        if (ok) {
          onPass(answers);
        }
      }}
    >
      <h2 className="text-lg font-medium">{work.title}</h2>
      {work.questions.map((question, questionIndex) => {
        const name = `q-${questionIndex}`;
        const selected = picked[questionIndex];
        const show = (checked || done) && selected !== null;
        return (
          <fieldset key={question.prompt} className="space-y-2">
            <legend className="mb-2 text-sm font-medium">
              <InlineMarkup text={question.prompt} />
            </legend>
            <RadioGroup
              value={selected === null ? "" : String(selected)}
              disabled={done}
              className="gap-2"
              onValueChange={(value) => {
                setChecked(false);
                setPicked((current) => {
                  const next = [...current];
                  next[questionIndex] = Number(value);
                  return next;
                });
              }}
            >
              {question.options.map((option, optionIndex) => {
                const id = `${name}-${optionIndex}`;
                const isPicked = selected === optionIndex;
                return (
                  <label
                    key={option}
                    htmlFor={id}
                    className={cn(
                      "flex items-start gap-3 rounded-lg border px-3 py-2.5 text-sm leading-6 transition-colors",
                      done
                        ? "cursor-default"
                        : "hover:bg-accent/40 cursor-pointer",
                      done && isPicked
                        ? "border-emerald-300 bg-emerald-50 text-emerald-950 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-50"
                        : "border-border",
                    )}
                  >
                    <RadioGroupItem
                      id={id}
                      value={String(optionIndex)}
                      className="mt-0.5"
                    />
                    <span className="min-w-0 flex-1">
                      <InlineMarkup text={option} />
                      {done && isPicked ? (
                        <span className="mt-0.5 block text-xs font-medium text-emerald-800 dark:text-emerald-200/90">
                          Ваш ответ
                        </span>
                      ) : null}
                    </span>
                  </label>
                );
              })}
            </RadioGroup>
            {show ? (
              <p className="text-muted-foreground text-sm leading-6">
                {selected === question.answer ? (
                  <InlineMarkup text={question.explain} />
                ) : (
                  "Не то. Прочитайте урок ещё раз и выберите другой вариант."
                )}
              </p>
            ) : null}
          </fieldset>
        );
      })}
      {done || passed ? (
        <PassedBanner />
      ) : (
        <Button type="submit" disabled={!allAnswered}>
          Проверить
        </Button>
      )}
    </form>
  );
}

function TaskWork({
  work,
  done,
  onPass,
}: {
  work: Extract<CourseWork, { type: "task" }>;
  done: boolean;
  onPass: (answers?: number[]) => void;
}) {
  const [ticks, setTicks] = useState<boolean[]>(() =>
    work.criteria.map(() => done),
  );
  const all = ticks.every(Boolean);

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        if (all) {
          onPass();
        }
      }}
    >
      <h2 className="text-lg font-medium">{work.title}</h2>
      <p className="text-muted-foreground text-sm leading-6">
        Сделайте в проекте и отметьте пункты. Пока нет автотестов — сдаёте по
        честному чеклисту.
      </p>
      <ul className="space-y-2">
        {work.criteria.map((item, index) => {
          const id = `c-${index}`;
          return (
            <li key={item}>
              <label
                htmlFor={id}
                className={cn(
                  "flex items-start gap-3 rounded-lg border px-3 py-2.5 text-sm leading-6 transition-colors",
                  done ? "cursor-default" : "cursor-pointer",
                  ticks[index]
                    ? "border-primary/70 bg-primary/15 dark:border-primary dark:bg-primary/20"
                    : "border-border hover:bg-accent/40",
                )}
              >
                <Checkbox
                  id={id}
                  className="mt-0.5"
                  checked={ticks[index]}
                  disabled={done}
                  onCheckedChange={(value) => {
                    setTicks((current) => {
                      const next = [...current];
                      next[index] = value === true;
                      return next;
                    });
                  }}
                />
                <span className="min-w-0 flex-1">
                  <InlineMarkup text={item} />
                </span>
              </label>
            </li>
          );
        })}
      </ul>
      {done ? (
        <PassedBanner />
      ) : (
        <Button type="submit" disabled={!all}>
          Сдать задачу
        </Button>
      )}
    </form>
  );
}

function PassedBanner() {
  return (
    <div
      role="status"
      className="flex gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-emerald-950 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-50"
    >
      <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
      <div>
        <p className="font-medium">Урок пройден</p>
        <p className="mt-1 text-sm leading-6 text-emerald-800 dark:text-emerald-200/90">
          Можно открывать следующий.
        </p>
      </div>
    </div>
  );
}
