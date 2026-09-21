import { Link } from "react-router";
import { RatingLabel } from "@/entities/user";
import { useMe } from "@/features/auth";
import { useUpdateProfile } from "@/features/offer-mentoring";
import { routes } from "@/shared/config/routes";
import { Badge } from "@/shared/ui/badge";
import { Switch } from "@/shared/ui/switch";
import { AppShell } from "@/widgets/app-shell";
import { ProfileForm } from "./profile-form";

export function MePage() {
  const { data: me, isPending, isError } = useMe();
  const update = useUpdateProfile();

  if (isPending) {
    return (
      <AppShell>
        <p className="text-muted-foreground">Загрузка…</p>
      </AppShell>
    );
  }

  if (isError || !me) {
    return (
      <AppShell>
        <p>Не удалось загрузить профиль. Проверьте, что API запущен.</p>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-xl">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <h1 className="text-3xl">Профиль</h1>
          {me.mentorOffered ? <Badge>Ментор</Badge> : null}
        </div>
        <p className="text-muted-foreground mb-6 text-sm">
          Публичная страница:{" "}
          <Link
            to={routes.profile(me.slug)}
            className="text-primary underline-offset-4 transition-colors hover:underline"
          >
            {routes.profile(me.slug)}
          </Link>
        </p>
        <div className="mb-6 grid gap-5 sm:grid-cols-2">
          <RatingLabel label="Как ментор" rating={me.mentorRating} />
          <RatingLabel label="Как ученик" rating={me.studentRating} />
        </div>
        <div className="hover:border-ring/40 mb-8 flex items-center justify-between gap-4 rounded-md border p-3 transition-colors">
          <div>
            <p className="text-sm font-medium">Режим ментора</p>
            <p className="text-muted-foreground text-sm leading-5">
              Вас будет видно в каталоге, ученики смогут отправить заявку.
            </p>
          </div>
          <Switch
            checked={me.mentorOffered}
            disabled={update.isPending}
            aria-label="Режим ментора"
            onCheckedChange={(checked) => {
              update.mutate({ mentorOffered: checked });
            }}
          />
        </div>
        <ProfileForm key={me.id} me={me} />
      </div>
    </AppShell>
  );
}
