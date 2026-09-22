import { Link } from "react-router";
import { GradeBadge } from "@/entities/user";
import { routes } from "@/shared/config/routes";
import { Badge } from "@/shared/ui/badge";
import {
  courseTechTitle,
  formatModules,
  formatSections,
  sectionCount,
} from "../lib/course-format";
import { COURSE_TECHS, type Course } from "../model/types";
import { CourseTechIcon } from "./course-tech-icon";

type CourseCardProps = {
  course: Course;
};

export function CourseCard({ course }: CourseCardProps) {
  const tech = COURSE_TECHS.find((item) => item.id === course.tech);

  return (
    <Link
      to={routes.course(course.slug)}
      className="hover:bg-accent/40 -mx-3 flex flex-col gap-4 rounded-lg px-3 py-4 transition-colors sm:flex-row sm:items-stretch"
    >
      <div
        className="relative flex aspect-video w-full shrink-0 items-center justify-center overflow-hidden rounded-md sm:aspect-auto sm:h-[7.5rem] sm:w-56"
        style={{
          backgroundColor: `color-mix(in srgb, ${tech?.hex ?? "#888"} 18%, transparent)`,
        }}
      >
        <CourseTechIcon
          id={course.tech}
          className="size-12"
          style={{ color: tech?.hex }}
        />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-start gap-2">
          <h2 className="text-[17px] leading-6 font-semibold">
            {course.title}
          </h2>
          {course.publisher === "platform" ? (
            <Badge variant="secondary">Front Enjoy</Badge>
          ) : null}
        </div>
        <p className="text-muted-foreground mt-1 line-clamp-2 text-sm leading-5">
          {course.subtitle}
        </p>
        <p className="text-muted-foreground mt-1 text-xs">
          {course.authorName} · {courseTechTitle(course.tech)}
        </p>
        <div className="mt-2">
          <GradeBadge grade={course.grade} />
        </div>
        <p className="text-muted-foreground mt-1 text-xs">
          {formatModules(course.modules.length)} ·{" "}
          {formatSections(sectionCount(course))}
        </p>
      </div>
    </Link>
  );
}
