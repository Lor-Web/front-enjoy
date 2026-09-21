import type { Lesson, LessonView } from "@/entities/lesson";
import { Button } from "@/shared/ui/button";
import { useLessonView } from "../model/use-lesson-view";

const LABELS: Record<LessonView, string> = {
  short: "Коротко",
  detailed: "Подробно",
  practices: "Лучшие практики",
};

type LessonViewToggleProps = {
  lesson: Lesson;
};

export function LessonViewToggle({ lesson }: LessonViewToggleProps) {
  const [view, setView] = useLessonView();
  const available = (Object.keys(LABELS) as LessonView[]).filter(
    (item) => lesson.variants[item],
  );

  if (available.length < 2) {
    return null;
  }

  return (
    <div
      role="tablist"
      aria-label="Вариант урока"
      className="mb-6 flex flex-wrap gap-1"
    >
      {available.map((item) => (
        <Button
          key={item}
          type="button"
          role="tab"
          aria-selected={view === item}
          variant={view === item ? "secondary" : "ghost"}
          size="sm"
          onClick={() => setView(item)}
        >
          {LABELS[item]}
        </Button>
      ))}
    </div>
  );
}
