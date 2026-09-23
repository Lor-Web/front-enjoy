import {
  countWords,
  estimateLessonMinutes,
  estimateQuizMinutes,
} from "@/shared/lib/reading-time";
import {
  COURSE_TECHS,
  type Course,
  type CourseFilters,
  type CourseModule,
  type CourseSection,
} from "../model/types";

export function filterCourses(courses: Course[], filters: CourseFilters) {
  const query = filters.q.trim().toLowerCase();

  const filtered = courses.filter((course) => {
    if (query) {
      const haystack =
        `${course.title} ${course.subtitle} ${course.authorName}`.toLowerCase();
      if (!haystack.includes(query)) {
        return false;
      }
    }
    if (filters.grade && course.grade !== filters.grade) {
      return false;
    }
    if (filters.tech && course.tech !== filters.tech) {
      return false;
    }
    if (filters.publisher && course.publisher !== filters.publisher) {
      return false;
    }
    return true;
  });

  return filtered.sort((a, b) => a.title.localeCompare(b.title, "ru"));
}

export function sectionCount(course: Course) {
  return course.modules.reduce(
    (sum, module) => sum + module.sections.length,
    0,
  );
}

export function formatModules(count: number) {
  return `${count} ${plural(count, "модуль", "модуля", "модулей")}`;
}

export function formatSections(count: number) {
  return `${count} ${plural(count, "раздел", "раздела", "разделов")}`;
}

export function formatCourses(count: number) {
  return `${count} ${plural(count, "курс", "курса", "курсов")}`;
}

export function courseTechTitle(id: Course["tech"]) {
  return COURSE_TECHS.find((item) => item.id === id)?.title ?? id;
}

export function findModule(course: Course, moduleSlug: string) {
  return course.modules.find((module) => module.slug === moduleSlug) ?? null;
}

export function findSection(module: CourseModule, sectionSlug: string) {
  return (
    module.sections.find((section) => section.slug === sectionSlug) ?? null
  );
}

export function flattenSections(course: Course) {
  return course.modules.flatMap((module) =>
    module.sections.map((section) => ({ module, section })),
  );
}

export function sectionKey(moduleSlug: string, sectionSlug: string) {
  return `${moduleSlug}/${sectionSlug}`;
}

export function isModuleUnlocked(
  course: Course,
  moduleSlug: string,
  completed: ReadonlySet<string>,
) {
  const index = course.modules.findIndex(
    (module) => module.slug === moduleSlug,
  );
  if (index <= 0) {
    return index === 0;
  }
  const previous = course.modules[index - 1];
  if (!previous || previous.sections.length === 0) {
    return false;
  }
  return previous.sections.every((section) =>
    completed.has(sectionKey(previous.slug, section.slug)),
  );
}

export function isSectionUnlocked(
  course: Course,
  moduleSlug: string,
  sectionSlug: string,
  completed: ReadonlySet<string>,
) {
  if (!isModuleUnlocked(course, moduleSlug, completed)) {
    return false;
  }
  const module = findModule(course, moduleSlug);
  if (!module) {
    return false;
  }
  const index = module.sections.findIndex((item) => item.slug === sectionSlug);
  if (index < 0) {
    return false;
  }
  if (index === 0) {
    return true;
  }
  const previous = module.sections[index - 1];
  return completed.has(sectionKey(module.slug, previous.slug));
}

export function firstSection(course: Course) {
  return flattenSections(course)[0] ?? null;
}

export function nextIncompleteSection(
  course: Course,
  completed: ReadonlySet<string>,
) {
  return (
    flattenSections(course).find(
      ({ module, section }) =>
        isSectionUnlocked(course, module.slug, section.slug, completed) &&
        !completed.has(sectionKey(module.slug, section.slug)),
    ) ?? null
  );
}

export function completedCount(course: Course, completed: ReadonlySet<string>) {
  return flattenSections(course).filter(({ module, section }) =>
    completed.has(sectionKey(module.slug, section.slug)),
  ).length;
}

export function progressPercent(
  course: Course,
  completed: ReadonlySet<string>,
) {
  const total = sectionCount(course);
  if (total === 0) {
    return 0;
  }
  return Math.round((completedCount(course, completed) / total) * 100);
}

export function formatProgress(done: number, total: number) {
  return `${done} из ${formatSections(total)}`;
}

export function neighborSections(
  course: Course,
  moduleSlug: string,
  sectionSlug: string,
) {
  const flat = flattenSections(course);
  const index = flat.findIndex(
    (item) =>
      item.module.slug === moduleSlug && item.section.slug === sectionSlug,
  );
  return {
    prev: index > 0 ? flat[index - 1] : null,
    next: index >= 0 && index < flat.length - 1 ? flat[index + 1] : null,
  };
}

export function estimateCourseSectionMinutes(section: CourseSection) {
  const chunks: string[] = [];
  let codeBlocks = 0;
  for (const block of section.body) {
    if (block.type === "code") {
      codeBlocks += 1;
    } else if (block.type === "ul") {
      chunks.push(...block.items);
    } else if (block.type === "table") {
      chunks.push(...block.headers, ...block.rows.flat());
    } else {
      chunks.push(block.text);
    }
  }
  let minutes = estimateLessonMinutes(countWords(chunks.join(" ")), codeBlocks);
  if (section.work?.type === "quiz") {
    minutes += estimateQuizMinutes(section.work.questions.length);
  }
  if (section.work?.type === "task") {
    minutes += Math.max(2, section.work.criteria.length);
  }
  if (section.work?.type === "homework") {
    minutes += 40;
  }
  return minutes;
}

function plural(count: number, one: string, few: string, many: string) {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) {
    return one;
  }
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
    return few;
  }
  return many;
}
