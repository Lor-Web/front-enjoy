import { Link } from "react-router";
import { useMe } from "@/features/auth";
import { routes } from "@/shared/config/routes";
import { Button } from "@/shared/ui/button";
import {
  useCourseRepository,
  useCreateCourseRepository,
} from "../model/use-github";

type CourseRepoCtaProps = {
  slug: string;
};

export function CourseRepoCta({ slug }: CourseRepoCtaProps) {
  const { data: me, isLoading: meLoading } = useMe();
  const signedIn = Boolean(me);
  const { data: repo, isLoading: repoLoading } = useCourseRepository(
    slug,
    signedIn,
  );
  const create = useCreateCourseRepository(slug);

  if (meLoading || (signedIn && repoLoading)) {
    return (
      <p className="text-muted-foreground mt-4 text-center text-sm">
        Загрузка…
      </p>
    );
  }

  if (!signedIn) {
    return (
      <Button asChild className="mt-4 w-full">
        <Link to={routes.login} state={{ from: routes.course(slug) }}>
          Войти, чтобы получить репозиторий
        </Link>
      </Button>
    );
  }

  if (!me?.githubLogin) {
    return (
      <Button asChild className="mt-4 w-full">
        <Link to={routes.me}>Подключить GitHub</Link>
      </Button>
    );
  }

  if (repo) {
    return (
      <Button asChild className="mt-4 w-full">
        <a href={repo.htmlUrl} target="_blank" rel="noreferrer">
          Открыть репозиторий
        </a>
      </Button>
    );
  }

  return (
    <Button
      type="button"
      className="mt-4 w-full"
      disabled={create.isPending}
      onClick={() => create.mutate()}
    >
      Получить репозиторий
    </Button>
  );
}
