import { Link } from "react-router";
import {
  findCourse,
  findModule,
  HomeworkChecksStatus,
  homeworkTitle,
} from "@/entities/course";
import { routes } from "@/shared/config/routes";
import { Button } from "@/shared/ui/button";
import { useHomeworkInbox, useReviewHomework } from "../model/use-inbox";

export function HomeworkInbox({ enabled }: { enabled: boolean }) {
  const inbox = useHomeworkInbox(enabled);
  const review = useReviewHomework();
  const items = inbox.data ?? [];

  return (
    <section>
      <h2 className="mb-1 text-xl">Домашние работы</h2>
      {inbox.isLoading ? (
        <p className="text-muted-foreground text-sm">Загрузка…</p>
      ) : items.length ? (
        <ul className="divide-y border-y">
          {items.map((item) => {
            const course = findCourse(item.courseSlug);
            const module = course ? findModule(course, item.moduleSlug) : null;
            const title = homeworkTitle(
              course?.title ?? item.courseSlug,
              module?.title ?? item.moduleSlug,
            );
            return (
              <li key={item.id} className="space-y-2 py-4">
                <p className="font-medium">
                  <Link
                    to={routes.profile(item.student.slug)}
                    className="hover:text-primary underline-offset-4 hover:underline"
                  >
                    {item.student.name}
                  </Link>
                </p>
                <p className="text-muted-foreground text-sm leading-6">
                  {title}
                </p>
                <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm leading-6">
                  <HomeworkChecksStatus checks={item.checks} />
                  <a
                    href={item.prUrl}
                    className="text-primary underline-offset-4 hover:underline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Открыть pull request
                  </a>
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    disabled={review.isPending || item.checks !== "success"}
                    onClick={() =>
                      review.mutate({ id: item.id, decision: "accepted" })
                    }
                  >
                    Принять
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={review.isPending}
                    onClick={() =>
                      review.mutate({ id: item.id, decision: "rejected" })
                    }
                  >
                    Отклонить
                  </Button>
                </div>
                {item.checks !== "success" ? (
                  <p className="text-muted-foreground text-sm">
                    Принять можно после зелёных тестов на PR.
                  </p>
                ) : null}
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-muted-foreground text-sm">
          Нет работ, которые ждут вашей проверки
        </p>
      )}
    </section>
  );
}
