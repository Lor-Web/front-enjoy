import { useAtomValue } from "jotai";
import { Link } from "react-router";
import { useMyMentors } from "@/entities/mentorship";
import { tokenAtom } from "@/features/auth";
import { routes } from "@/shared/config/routes";
import { Button } from "@/shared/ui/button";
import { useRequestMentorship } from "../model/use-request-mentorship";

type RequestMentorshipButtonProps = {
  mentorSlug: string;
  loggedIn: boolean;
};

export function RequestMentorshipButton({
  mentorSlug,
  loggedIn,
}: RequestMentorshipButtonProps) {
  const token = useAtomValue(tokenAtom);
  const mentors = useMyMentors(loggedIn ? token : null);
  const request = useRequestMentorship();

  if (!loggedIn) {
    return (
      <Button asChild>
        <Link to={routes.login}>Войдите, чтобы отправить заявку</Link>
      </Button>
    );
  }

  if (mentors.isPending) {
    return null;
  }

  const relation = mentors.data?.find(
    (item) =>
      item.mentor.slug === mentorSlug &&
      (item.status === "pending" || item.status === "active"),
  );
  const status = relation?.status ?? (request.isSuccess ? "pending" : null);

  if (status === "active") {
    return (
      <p className="text-muted-foreground text-sm">
        Вы уже учитесь у этого ментора.{" "}
        <Link to={routes.cabinet} className="text-primary hover:underline">
          Кабинет
        </Link>
      </p>
    );
  }

  if (status === "pending") {
    return <p className="text-muted-foreground text-sm">Заявка отправлена</p>;
  }

  return (
    <Button
      type="button"
      disabled={request.isPending}
      onClick={() => request.mutate(mentorSlug)}
    >
      Стать учеником
    </Button>
  );
}
