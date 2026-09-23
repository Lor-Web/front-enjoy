import { useAtomValue } from "jotai";
import { Link } from "react-router";
import { useLessons } from "@/entities/lesson";
import { useIncoming, useMyMentors, useStudents } from "@/entities/mentorship";
import { courseProgressPercent } from "@/entities/progress";
import { ContactLinks, type Mentorship } from "@/entities/user";
import { tokenAtom } from "@/features/auth";
import { RateUserForm } from "@/features/rate-user";
import { useMentorshipAction } from "@/features/request-mentorship";
import { HomeworkInbox } from "@/features/review-homework";
import { routes } from "@/shared/config/routes";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Progress } from "@/shared/ui/progress";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/ui/sheet";
import { AppShell } from "@/widgets/app-shell";

export function CabinetPage() {
  const token = useAtomValue(tokenAtom);
  const incoming = useIncoming(token);
  const students = useStudents(token);
  const mentors = useMyMentors(token);
  const { data: lessons = [] } = useLessons();
  const actions = useMentorshipAction();
  const lessonRefs = lessons.map((lesson) => ({
    slug: lesson.slug,
    quizSlug: lesson.quizSlug,
  }));

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl space-y-12">
        <div>
          <h1 className="mb-2 text-3xl sm:text-4xl">Кабинет</h1>
          <p className="text-muted-foreground text-[17px] leading-7">
            Заявки, домашние работы, ученики и менторы. Контакты — в профиле.
          </p>
        </div>

        <section>
          <h2 className="mb-1 text-xl">Входящие заявки</h2>
          {incoming.data?.length ? (
            <ul className="divide-y border-y">
              {incoming.data.map((item) => (
                <li
                  key={item.id}
                  className="flex flex-wrap items-center justify-between gap-3 py-3"
                >
                  <Link
                    to={routes.profile(item.student.slug)}
                    className="hover:text-primary font-medium underline-offset-4 transition-colors hover:underline"
                  >
                    {item.student.name}
                  </Link>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => actions.accept.mutate(item.id)}
                      disabled={actions.accept.isPending}
                    >
                      Принять
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => actions.decline.mutate(item.id)}
                      disabled={actions.decline.isPending}
                    >
                      Отклонить
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground text-sm">Пока пусто</p>
          )}
        </section>

        <HomeworkInbox enabled={Boolean(token)} />

        <section>
          <h2 className="mb-1 text-xl">Мои ученики</h2>
          {students.data?.length ? (
            <ul className="divide-y border-y">
              {students.data.map((item) => {
                const percent = courseProgressPercent(
                  item.progress,
                  lessonRefs,
                );
                return (
                  <li key={item.id} className="py-4">
                    <div className="flex items-baseline justify-between gap-3">
                      <Link
                        to={routes.profile(item.student.slug)}
                        className="hover:text-primary font-medium underline-offset-4 transition-colors hover:underline"
                      >
                        {item.student.name}
                      </Link>
                      <span className="text-muted-foreground text-sm tabular-nums">
                        {percent}%
                      </span>
                    </div>
                    <Progress value={percent} className="mt-2" />
                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                      <Link
                        to={routes.studentProgress(item.id)}
                        className="text-primary underline-offset-4 transition-colors hover:underline"
                      >
                        Прогресс
                      </Link>
                      <ContactLinks
                        contacts={item.student.contacts}
                        email={item.student.email}
                        otherContacts={item.student.otherContacts}
                      />
                      <button
                        type="button"
                        className="text-muted-foreground hover:text-foreground rounded-sm transition-colors"
                        onClick={() => actions.end.mutate(item.id)}
                        disabled={actions.end.isPending}
                      >
                        Завершить
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-muted-foreground text-sm">Пока нет учеников</p>
          )}
        </section>

        <section>
          <h2 className="mb-1 text-xl">Мои менторы</h2>
          {mentors.data?.length ? (
            <ul className="divide-y border-y">
              {mentors.data.map((item) => (
                <li key={item.id} className="py-4">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <Link
                      to={routes.profile(item.mentor.slug)}
                      className="hover:text-primary font-medium underline-offset-4 transition-colors hover:underline"
                    >
                      {item.mentor.name}
                    </Link>
                    <Badge variant="outline">{statusLabel(item.status)}</Badge>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                    {item.status === "active" ? (
                      <ContactLinks
                        contacts={item.mentor.contacts}
                        email={item.mentor.email}
                        otherContacts={item.mentor.otherContacts}
                      />
                    ) : null}
                    {item.status === "active" || item.status === "ended" ? (
                      <RatingSheet mentorship={item} />
                    ) : null}
                    {item.status === "active" ? (
                      <button
                        type="button"
                        className="text-muted-foreground hover:text-foreground rounded-sm transition-colors"
                        onClick={() => actions.end.mutate(item.id)}
                        disabled={actions.end.isPending}
                      >
                        Завершить
                      </button>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground text-sm">
              Пока нет менторов. Загляните в{" "}
              <Link
                to={routes.users}
                className="text-primary underline-offset-4 transition-colors hover:underline"
              >
                каталог
              </Link>
              .
            </p>
          )}
        </section>
      </div>
    </AppShell>
  );
}

function RatingSheet({ mentorship }: { mentorship: Mentorship }) {
  const current = mentorship.myRatings.find(
    (item) => item.aspect === "asMentor",
  );

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          type="button"
          className="text-primary underline-offset-4 transition-colors hover:underline"
        >
          {current ? `Оценка ${current.score}` : "Оценка"}
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[min(24rem,100%)] p-0">
        <SheetHeader className="border-b">
          <SheetTitle>Оценка ментору</SheetTitle>
          <SheetDescription>
            Оценка и отзыв для {mentorship.mentor.name}
          </SheetDescription>
        </SheetHeader>
        <div className="p-4">
          <RateUserForm mentorship={mentorship} aspect="asMentor" hideHeading />
        </div>
      </SheetContent>
    </Sheet>
  );
}

function statusLabel(status: string) {
  if (status === "pending") {
    return "Заявка";
  }
  if (status === "active") {
    return "Учитесь";
  }
  if (status === "ended") {
    return "Завершено";
  }
  return status;
}
