import { useAtom } from "jotai";
import { useSearchParams } from "react-router";
import { isLessonView, type LessonView } from "@/entities/lesson";
import { lessonViewAtom } from "./lesson-view-atom";

export function useLessonView(): [LessonView, (view: LessonView) => void] {
  const [searchParams, setSearchParams] = useSearchParams();
  const [stored, setStored] = useAtom(lessonViewAtom);
  const param = searchParams.get("view");
  const view = param && isLessonView(param) ? param : stored;

  const setView = (next: LessonView) => {
    setStored(next);
    setSearchParams(
      (prev) => {
        const nextParams = new URLSearchParams(prev);
        if (next === "short") {
          nextParams.delete("view");
        } else {
          nextParams.set("view", next);
        }
        return nextParams;
      },
      { replace: true },
    );
  };

  return [view, setView];
}
