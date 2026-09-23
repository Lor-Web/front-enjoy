export type HomeworkChecks = "pending" | "success" | "failure" | "unknown";
export type HomeworkStatus = "pending" | "accepted" | "rejected";

export type CourseHomework = {
  id: string;
  courseSlug: string;
  moduleSlug: string;
  prUrl: string;
  submittedAt: string;
  reviewedAt: string | null;
  status: HomeworkStatus;
  checks: HomeworkChecks;
  mentorId: string | null;
  mentorName: string | null;
  mentorSlug: string | null;
  student: { id: string; name: string; slug: string };
};

export function homeworkTitle(courseTitle: string, moduleTitle: string) {
  return `${courseTitle} · ${moduleTitle}`;
}

export function checksLabel(checks: HomeworkChecks) {
  if (checks === "success") {
    return "Тесты пройдены";
  }
  if (checks === "failure") {
    return "Тесты не пройдены";
  }
  if (checks === "pending") {
    return "Тесты выполняются";
  }
  return "Статус тестов пока неизвестен";
}
