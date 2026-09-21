import type {
  Lesson,
  LessonHeading,
  LessonMeta,
  LessonVariant,
  LessonView,
} from "../model/types";
import { isLessonView } from "../model/types";

type LessonJsonModule = { default: LessonMeta };

type LessonMdxModule = {
  default: LessonVariant["Content"];
  headings?: LessonHeading[];
  readingMinutes?: number;
};

const metaModules = import.meta.glob<LessonJsonModule>(
  "../../../../content/tracks/react/lessons/*/lesson.json",
  { eager: true },
);

const mdxModules = import.meta.glob<LessonMdxModule>(
  "../../../../content/tracks/react/lessons/*/*.mdx",
  { eager: true },
);

function viewFromPath(
  filePath: string,
): { slug: string; view: LessonView } | undefined {
  const match = filePath.match(
    /lessons\/([^/]+)\/(short|detailed|best-practices)\.mdx$/,
  );
  if (!match) {
    return undefined;
  }
  const viewName = match[2] === "best-practices" ? "practices" : match[2];
  if (!isLessonView(viewName)) {
    return undefined;
  }
  return { slug: match[1], view: viewName };
}

export function loadLessons(): Lesson[] {
  const bySlug = new Map<string, Lesson>();

  for (const [filePath, mod] of Object.entries(metaModules)) {
    const slug = filePath.match(/lessons\/([^/]+)\/lesson\.json$/)?.[1];
    if (!slug) {
      continue;
    }
    bySlug.set(slug, {
      ...mod.default,
      slug: mod.default.slug ?? slug,
      subtopics: [],
      variants: {},
    });
  }

  for (const [filePath, mod] of Object.entries(mdxModules)) {
    const parsed = viewFromPath(filePath);
    if (!parsed) {
      continue;
    }
    const lesson = bySlug.get(parsed.slug);
    if (!lesson) {
      continue;
    }
    lesson.variants[parsed.view] = {
      view: parsed.view,
      Content: mod.default,
      headings: mod.headings ?? [],
      readingMinutes: mod.readingMinutes ?? 2,
    };
  }

  return [...bySlug.values()]
    .filter((lesson) => lesson.variants.short)
    .map((lesson) => ({
      ...lesson,
      subtopics: (lesson.variants.short?.headings ?? [])
        .filter((heading) => heading.depth === 2)
        .map((heading) => ({ id: heading.id, title: heading.text })),
    }))
    .sort((a, b) => a.order - b.order);
}

export function loadLesson(slug: string): Lesson | undefined {
  return loadLessons().find((lesson) => lesson.slug === slug);
}

export function getLessonVariant(
  lesson: Lesson,
  view: LessonView,
): LessonVariant {
  const selected = lesson.variants[view];
  if (selected) {
    return selected;
  }
  const fallback = lesson.variants.short;
  if (!fallback) {
    throw new Error(`У урока нет короткого варианта: ${lesson.slug}`);
  }
  return fallback;
}

export function getNeighborLessons(slug: string): {
  prev?: Lesson;
  next?: Lesson;
} {
  const lessons = loadLessons();
  const index = lessons.findIndex((lesson) => lesson.slug === slug);
  if (index === -1) {
    return {};
  }
  return {
    prev: lessons[index - 1],
    next: lessons[index + 1],
  };
}
