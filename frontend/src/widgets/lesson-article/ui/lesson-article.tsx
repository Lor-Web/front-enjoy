import { MDXProvider } from "@mdx-js/react";
import type { ComponentProps } from "react";
import {
  getLessonVariant,
  type Lesson,
  type LessonView,
} from "@/entities/lesson";
import { ContentRating, lessonVoteKey } from "@/features/rate-content";
import { LessonViewToggle } from "@/features/select-lesson-view";
import { CodeBlock } from "@/shared/ui/code-block";
import { EstimatedTime } from "@/shared/ui/estimated-time";
import { ArticleHeading } from "./article-heading";

const mdxComponents = {
  h2: (props: ComponentProps<"h2">) => (
    <ArticleHeading
      as="h2"
      className="mt-10 mb-3 scroll-mt-24 text-2xl"
      {...props}
    />
  ),
  h3: (props: ComponentProps<"h3">) => (
    <ArticleHeading
      as="h3"
      className="mt-8 mb-2 scroll-mt-24 text-xl"
      {...props}
    />
  ),
  p: (props: ComponentProps<"p">) => (
    <p className="mb-4 text-[17px] leading-7" {...props} />
  ),
  a: (props: ComponentProps<"a">) => (
    <a className="text-primary underline-offset-4 hover:underline" {...props} />
  ),
  ul: (props: ComponentProps<"ul">) => (
    <ul className="mb-4 list-disc space-y-1 pl-5 text-[17px]" {...props} />
  ),
  ol: (props: ComponentProps<"ol">) => (
    <ol className="mb-4 list-decimal space-y-1 pl-5 text-[17px]" {...props} />
  ),
  li: (props: ComponentProps<"li">) => <li className="leading-7" {...props} />,
  pre: CodeBlock,
  code: ({ className, ...props }: ComponentProps<"code">) => {
    if (className) {
      return <code className={className} {...props} />;
    }
    return (
      <code
        className="bg-muted rounded px-1.5 py-0.5 font-mono text-[0.9em]"
        {...props}
      />
    );
  },
  blockquote: (props: ComponentProps<"blockquote">) => (
    <blockquote
      className="text-muted-foreground my-6 border-l-2 border-primary/40 pl-4"
      {...props}
    />
  ),
};

type LessonArticleProps = {
  lesson: Lesson;
  view: LessonView;
};

export function LessonArticle({ lesson, view }: LessonArticleProps) {
  const variant = getLessonVariant(lesson, view);
  const Content = variant.Content;

  return (
    <article className="mx-auto max-w-2xl">
      <p className="text-muted-foreground mb-3 text-sm">Урок {lesson.order}</p>
      <EstimatedTime minutes={variant.readingMinutes} />
      <ArticleHeading
        as="h1"
        className="mb-6 text-3xl leading-tight sm:text-4xl"
      >
        {lesson.title}
      </ArticleHeading>
      <LessonViewToggle lesson={lesson} />
      <MDXProvider components={mdxComponents}>
        <Content />
      </MDXProvider>
      <ContentRating targetId={lessonVoteKey(lesson.slug, variant.view)} />
      <p className="text-muted-foreground mt-10 text-sm leading-6">
        Программа урока опирается на{" "}
        <a
          href={lesson.sourceUrl}
          className="text-primary underline-offset-4 hover:underline"
          target="_blank"
          rel="noreferrer"
        >
          документацию React
        </a>
        . Оригинал — {lesson.sourceLicense}.
      </p>
    </article>
  );
}
