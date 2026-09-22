export {
  markLessonRead,
  recordQuizProgress,
  useProgress,
} from "./api/progress-queries";
export {
  courseProgressPercent,
  isLessonRead,
  isQuizPassed,
  trackProgressPercent,
} from "./model/progress";
export type { ProgressState } from "./model/types";
export { emptyProgress, normalizeProgress } from "./model/types";
