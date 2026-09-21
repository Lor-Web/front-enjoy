import { Link } from "react-router";
import { RatingLabel, useMentors } from "@/entities/user";
import { routes } from "@/shared/config/routes";
import { Badge } from "@/shared/ui/badge";
import { AppShell } from "@/widgets/app-shell";

export function MentorsPage() {
  const { data: mentors = [], isPending, isError } = useMentors();

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-3 text-3xl sm:text-4xl">Менторы</h1>
        <p className="text-muted-foreground mb-8 text-[17px] leading-7">
          Найдите человека, который поможет с треком. Заявка и прогресс — на
          сайте, общаться можно там, где вам удобно.
        </p>
        {isPending ? (
          <p className="text-muted-foreground">Загрузка…</p>
        ) : isError ? (
          <p>Не удалось загрузить каталог. Проверьте, что API запущен.</p>
        ) : mentors.length === 0 ? (
          <p className="text-muted-foreground">
            Пока никто не открыл набор учеников. Можно{" "}
            <Link to={routes.me} className="text-primary hover:underline">
              стать ментором
            </Link>{" "}
            в своём профиле.
          </p>
        ) : (
          <ul className="divide-y border-y">
            {mentors.map((mentor) => (
              <li key={mentor.id} className="py-4">
                <Link to={routes.profile(mentor.slug)} className="block">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="text-[17px]">{mentor.name}</span>
                    <Badge>Ментор</Badge>
                  </span>
                  {mentor.mentorBio ? (
                    <p className="text-muted-foreground mt-1 text-sm leading-6">
                      {mentor.mentorBio}
                    </p>
                  ) : null}
                  <div className="mt-3">
                    <RatingLabel
                      label="Как ментор"
                      rating={mentor.mentorRating}
                    />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </AppShell>
  );
}
