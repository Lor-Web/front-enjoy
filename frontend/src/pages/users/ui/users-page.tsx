import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import {
  GRADE_OPTIONS,
  type Grade,
  GradeBadge,
  type PublicProfile,
  RatingLabel,
  useUsers,
} from "@/entities/user";
import { routes } from "@/shared/config/routes";
import { Badge } from "@/shared/ui/badge";
import { Input } from "@/shared/ui/input";
import { Pagination } from "@/shared/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { Switch } from "@/shared/ui/switch";
import { AppShell } from "@/widgets/app-shell";

function readFilters(params: URLSearchParams) {
  const grade = params.get("grade");
  return {
    q: params.get("q") ?? "",
    mentors: params.get("mentors") === "1",
    grade: GRADE_OPTIONS.some((item) => item.value === grade)
      ? (grade as Grade)
      : ("" as const),
    page: Math.max(1, Number(params.get("page")) || 1),
  };
}

export function UsersPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = readFilters(searchParams);
  const [qInput, setQInput] = useState(filters.q);
  const { data, isPending, isError } = useUsers(filters);
  const hasFilters = Boolean(filters.q || filters.mentors || filters.grade);

  useEffect(() => {
    setQInput(filters.q);
  }, [filters.q]);

  useEffect(() => {
    const next = qInput.trim();
    if (next === filters.q) {
      return;
    }
    const timer = window.setTimeout(() => {
      writeFilters(setSearchParams, {
        q: next,
        mentors: filters.mentors,
        grade: filters.grade,
        page: 1,
      });
    }, 300);
    return () => window.clearTimeout(timer);
  }, [qInput, filters.q, filters.mentors, filters.grade, setSearchParams]);

  const users = data?.items ?? [];
  const total = data?.total ?? 0;
  const pages = data?.pages ?? 1;

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-3 text-3xl sm:text-4xl">Пользователи</h1>
        <p className="text-muted-foreground mb-6 text-[17px] leading-7">
          Все, кто зарегистрировался на платформе. Менторов можно отфильтровать
          и написать им заявку из профиля.
        </p>

        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="min-w-0 flex-1">
            <Input
              icon={Search}
              value={qInput}
              onChange={(event) => setQInput(event.target.value)}
              placeholder="Имя, город или страна"
              aria-label="Поиск пользователей"
            />
          </div>
          <Select
            value={filters.grade || "all"}
            onValueChange={(value) => {
              writeFilters(setSearchParams, {
                ...filters,
                grade: value === "all" ? "" : (value as Grade),
                page: 1,
              });
            }}
          >
            <SelectTrigger className="sm:w-44" size="sm" aria-label="Грейд">
              <SelectValue placeholder="Все грейды" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все грейды</SelectItem>
              {GRADE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex shrink-0 items-center gap-2 text-sm">
            <Switch
              checked={filters.mentors}
              onCheckedChange={(checked) => {
                writeFilters(setSearchParams, {
                  ...filters,
                  mentors: checked,
                  page: 1,
                });
              }}
              aria-label="Только менторы"
            />
            Только менторы
          </div>
        </div>

        {isPending && !data ? (
          <p className="text-muted-foreground">Загрузка…</p>
        ) : isError ? (
          <p>Не удалось загрузить список. Проверьте, что API запущен.</p>
        ) : users.length === 0 ? (
          <p className="text-muted-foreground">
            {hasFilters ? (
              "Никого не нашлось. Сбросьте фильтры или измените поиск."
            ) : (
              <>
                Пока никого нет. Можно{" "}
                <Link
                  to={routes.signup}
                  className="text-primary underline-offset-4 transition-colors hover:underline"
                >
                  зарегистрироваться
                </Link>
                .
              </>
            )}
          </p>
        ) : (
          <>
            <p className="text-muted-foreground mb-3 text-sm">
              {total} в каталоге
            </p>
            <ul className="divide-y border-y">
              {users.map((user) => (
                <li key={user.id}>
                  <Link
                    to={routes.profile(user.slug)}
                    className="hover:bg-accent/60 -mx-3 block rounded-md px-3 py-4 transition-colors"
                  >
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="text-[17px]">{user.name}</span>
                      {user.mentorOffered ? <Badge>Ментор</Badge> : null}
                    </span>
                    <UserMeta user={user} />
                    {user.mentorBio ? (
                      <p className="text-muted-foreground mt-1 text-sm leading-6">
                        {user.mentorBio}
                      </p>
                    ) : null}
                    {user.mentorOffered ? (
                      <div className="mt-3">
                        <RatingLabel
                          label="Как ментор"
                          rating={user.mentorRating}
                        />
                      </div>
                    ) : null}
                  </Link>
                </li>
              ))}
            </ul>
            <Pagination
              page={data?.page ?? filters.page}
              pages={pages}
              onPage={(page) =>
                writeFilters(setSearchParams, { ...filters, page })
              }
            />
          </>
        )}
      </div>
    </AppShell>
  );
}

function UserMeta({ user }: { user: PublicProfile }) {
  const location = [user.city, user.country].filter(Boolean).join(", ");
  if (!user.grade && !location) {
    return null;
  }
  return (
    <div className="mt-1.5 flex flex-wrap items-center gap-2">
      <GradeBadge grade={user.grade} />
      {location ? (
        <span className="text-muted-foreground text-sm">{location}</span>
      ) : null}
    </div>
  );
}

function writeFilters(
  setSearchParams: ReturnType<typeof useSearchParams>[1],
  next: ReturnType<typeof readFilters>,
) {
  const params = new URLSearchParams();
  if (next.q) {
    params.set("q", next.q);
  }
  if (next.mentors) {
    params.set("mentors", "1");
  }
  if (next.grade) {
    params.set("grade", next.grade);
  }
  if (next.page > 1) {
    params.set("page", String(next.page));
  }
  setSearchParams(params, { replace: true });
}
