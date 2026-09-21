import { useAtom, useAtomValue } from "jotai";
import { ChevronRight } from "lucide-react";
import { Link, useLocation } from "react-router";
import { getLessonVariant, useLessons } from "@/entities/lesson";
import { isLessonRead, isQuizPassed, progressAtom } from "@/entities/progress";
import { useLessonView } from "@/features/select-lesson-view";
import { routes } from "@/shared/config/routes";
import { scrollToHash } from "@/shared/lib/scroll-to-hash";
import { cn } from "@/shared/lib/utils";
import { nestHeadings } from "../lib/nest-headings";
import { navExpandedAtom } from "../model/nav-expanded-atom";
import { useActiveHeading } from "../model/use-active-heading";

export function LessonSidebar() {
  const { data: lessons = [] } = useLessons();
  const progress = useAtomValue(progressAtom);
  const location = useLocation();
  const [view] = useLessonView();
  const [expandedMap, setExpandedMap] = useAtom(navExpandedAtom);

  const activeLesson = lessons.find(
    (lesson) =>
      location.pathname === routes.lesson(lesson.slug) ||
      location.pathname === routes.quiz(lesson.slug),
  );
  const onLessonPage =
    activeLesson !== undefined &&
    location.pathname === routes.lesson(activeLesson.slug);

  const activeHeadings =
    activeLesson && onLessonPage
      ? getLessonVariant(activeLesson, view).headings
      : [];
  const activeId = useActiveHeading(
    activeHeadings.map((heading) => heading.id),
  );

  return (
    <nav aria-label="Оглавление трека" className="px-3 py-4">
      <p className="text-muted-foreground px-2 pb-3 text-xs font-medium tracking-wide uppercase">
        React
      </p>
      <ol className="space-y-1">
        {lessons.map((lesson, index) => {
          const active = activeLesson?.slug === lesson.slug;
          const read = isLessonRead(progress, lesson.slug);
          const passed = isQuizPassed(progress, lesson.quizSlug);
          const headings =
            active && onLessonPage
              ? activeHeadings
              : (lesson.variants.short?.headings ?? []).filter(
                  (heading) => heading.depth === 2,
                );
          const sections = nestHeadings(headings);
          const expanded = expandedMap[lesson.slug] ?? active;
          const showToggle = sections.length > 0;

          return (
            <li key={lesson.slug}>
              <div className="flex items-start">
                {showToggle ? (
                  <button
                    type="button"
                    aria-expanded={expanded}
                    aria-label={
                      expanded
                        ? `Свернуть разделы: ${lesson.title}`
                        : `Развернуть разделы: ${lesson.title}`
                    }
                    className="text-muted-foreground hover:bg-accent hover:text-foreground mt-1.5 flex size-6 shrink-0 items-center justify-center rounded-sm transition-colors"
                    onClick={() =>
                      setExpandedMap((prev) => ({
                        ...prev,
                        [lesson.slug]: !expanded,
                      }))
                    }
                  >
                    <ChevronRight
                      className={cn(
                        "size-3.5 transition-transform",
                        expanded && "rotate-90",
                      )}
                    />
                  </button>
                ) : (
                  <span className="size-6 shrink-0" />
                )}
                <Link
                  to={routes.toLesson(lesson.slug)}
                  className={cn(
                    "min-w-0 flex-1 rounded-md px-1.5 py-1.5 text-sm leading-5 transition-colors",
                    active
                      ? "bg-accent text-foreground"
                      : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
                  )}
                >
                  <span className="flex items-start gap-2">
                    <span className="mt-0.5 w-4 shrink-0 text-right font-mono text-xs">
                      {index + 1}
                    </span>
                    <span className="min-w-0">
                      <span className="block">{lesson.title}</span>
                      <span className="text-muted-foreground mt-0.5 block text-xs">
                        {passed ? "Квиз сдан" : read ? "Прочитано" : "Не начат"}
                      </span>
                    </span>
                  </span>
                </Link>
              </div>
              {expanded && sections.length > 0 ? (
                <ol className="mt-0.5 ml-6 space-y-0.5 border-l pl-2">
                  {sections.map((section) => {
                    const sectionCurrent =
                      active && onLessonPage && section.id === activeId;
                    return (
                      <li key={`${lesson.slug}:${section.id}`}>
                        <HeadingLink
                          text={section.text}
                          current={sectionCurrent}
                          href={headingHref(
                            active && onLessonPage,
                            lesson.slug,
                            section.id,
                          )}
                          samePage={active && onLessonPage}
                        />
                        {section.children.length > 0 ? (
                          <ol className="mt-0.5 space-y-0.5 pl-3">
                            {section.children.map((child) => (
                              <li key={`${lesson.slug}:${child.id}`}>
                                <HeadingLink
                                  text={child.text}
                                  current={
                                    active &&
                                    onLessonPage &&
                                    child.id === activeId
                                  }
                                  href={headingHref(
                                    active && onLessonPage,
                                    lesson.slug,
                                    child.id,
                                  )}
                                  samePage={active && onLessonPage}
                                />
                              </li>
                            ))}
                          </ol>
                        ) : null}
                      </li>
                    );
                  })}
                </ol>
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function headingHref(onCurrentLesson: boolean, slug: string, id: string) {
  if (onCurrentLesson) {
    return `#${id}`;
  }
  return routes.lesson(slug, { hash: id });
}

function HeadingLink({
  text,
  current,
  href,
  samePage,
}: {
  text: string;
  current: boolean;
  href: string;
  samePage: boolean;
}) {
  const className = cn(
    "block rounded-md px-2 py-1 text-[13px] leading-5 transition-colors",
    current
      ? "bg-accent text-foreground"
      : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
  );

  if (samePage) {
    return (
      <a
        href={href}
        className={className}
        onClick={(event) => {
          event.preventDefault();
          window.location.hash = href;
          scrollToHash(href);
        }}
      >
        {text}
      </a>
    );
  }

  return (
    <Link to={href} className={className}>
      {text}
    </Link>
  );
}
