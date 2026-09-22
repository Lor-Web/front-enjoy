import { Check, Lock } from "lucide-react";
import { Link, NavLink } from "react-router";
import {
  type Course,
  completedCount,
  formatProgress,
  isSectionUnlocked,
  progressPercent,
  sectionCount,
  sectionKey,
} from "@/entities/course";
import { routes } from "@/shared/config/routes";
import { cn } from "@/shared/lib/utils";
import { Progress } from "@/shared/ui/progress";

export function CourseSidebar({
  course,
  completed,
  started,
}: {
  course: Course;
  completed: ReadonlySet<string>;
  started: boolean;
}) {
  const total = sectionCount(course);
  const done = completedCount(course, completed);

  return (
    <nav aria-label="Оглавление курса" className="px-3 py-4">
      <Link
        to={routes.course(course.slug)}
        className="text-muted-foreground hover:text-foreground mb-3 block px-2 text-xs font-medium tracking-wide uppercase transition-colors"
      >
        {course.title}
      </Link>
      {started && total > 0 ? (
        <div className="mb-4 space-y-2 px-2">
          <p className="text-muted-foreground text-xs">
            {formatProgress(done, total)}
          </p>
          <Progress value={progressPercent(course, completed)} />
        </div>
      ) : null}
      <ol className="space-y-4">
        {course.modules.map((module) => (
          <li key={module.slug}>
            <p className="text-foreground px-2 text-xs font-medium tracking-wide">
              {module.title}
            </p>
            {module.sections.length === 0 ? (
              <p className="text-muted-foreground mt-1 px-2 text-xs leading-5">
                Уроки появятся после предыдущего модуля.
              </p>
            ) : (
              <ol className="mt-1 space-y-0.5">
                {module.sections.map((section, index) => {
                  const open = isSectionUnlocked(
                    course,
                    module.slug,
                    section.slug,
                    completed,
                  );
                  const passed = completed.has(
                    sectionKey(module.slug, section.slug),
                  );
                  const href = routes.courseSection(
                    course.slug,
                    module.slug,
                    section.slug,
                  );
                  const row = (
                    <span className="flex items-start gap-2">
                      <span className="mt-0.5 w-4 shrink-0 text-right font-mono text-xs">
                        {index + 1}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block">{section.title}</span>
                        {passed ? (
                          <span className="mt-0.5 flex items-center gap-1 text-xs text-emerald-700 dark:text-emerald-400">
                            <Check className="size-3" />
                            Пройден
                          </span>
                        ) : open ? null : (
                          <span className="text-muted-foreground mt-0.5 flex items-center gap-1 text-xs">
                            <Lock className="size-3" />
                            Закрыт
                          </span>
                        )}
                      </span>
                    </span>
                  );

                  return (
                    <li key={section.slug}>
                      {open ? (
                        <NavLink
                          to={href}
                          className={({ isActive }) =>
                            cn(
                              "block rounded-md px-2 py-1.5 text-sm leading-5 transition-colors",
                              isActive
                                ? "bg-accent text-foreground"
                                : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
                            )
                          }
                        >
                          {row}
                        </NavLink>
                      ) : (
                        <p className="text-muted-foreground rounded-md px-2 py-1.5 text-sm leading-5">
                          {row}
                        </p>
                      )}
                    </li>
                  );
                })}
              </ol>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
