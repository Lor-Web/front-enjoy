import { useState } from "react";
import { Link } from "react-router";
import { CONTACT_FIELDS, emptyContacts, RatingLabel } from "@/entities/user";
import { useMe } from "@/features/auth";
import { useUpdateProfile } from "@/features/offer-mentoring";
import { routes } from "@/shared/config/routes";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Switch } from "@/shared/ui/switch";
import { Textarea } from "@/shared/ui/textarea";
import { AppShell } from "@/widgets/app-shell";

export function MePage() {
  const { data: me, isPending, isError } = useMe();
  const update = useUpdateProfile();
  const [name, setName] = useState<string | null>(null);
  const [mentorBio, setMentorBio] = useState<string | null>(null);
  const [contacts, setContacts] = useState<Partial<Record<string, string>>>({});

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

  const nameValue = name ?? me.name;
  const bioValue = mentorBio ?? me.mentorBio ?? "";
  const contactValues = { ...emptyContacts, ...me.contacts, ...contacts };

  return (
    <AppShell>
      <div className="mx-auto max-w-md">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <h1 className="text-3xl">Профиль</h1>
          {me.mentorOffered ? <Badge>Ментор</Badge> : null}
        </div>
        <p className="text-muted-foreground mb-2 text-sm">{me.email}</p>
        <p className="text-muted-foreground mb-6 text-sm">
          Публичная страница:{" "}
          <Link
            to={routes.profile(me.slug)}
            className="text-primary hover:underline"
          >
            {routes.profile(me.slug)}
          </Link>
        </p>
        <div className="mb-6 grid gap-5">
          <RatingLabel label="Как ментор" rating={me.mentorRating} />
          <RatingLabel label="Как ученик" rating={me.studentRating} />
        </div>
        <div className="mb-8 flex items-center justify-between gap-4 rounded-md border p-3">
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
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            update.mutate({
              name: nameValue,
              mentorBio: bioValue,
              contacts: {
                telegram: contactValues.telegram ?? "",
                vk: contactValues.vk ?? "",
                discord: contactValues.discord ?? "",
                github: contactValues.github ?? "",
              },
            });
          }}
        >
          <label className="block space-y-1 text-sm" htmlFor="me-name">
            <span>Имя</span>
            <Input
              id="me-name"
              value={nameValue}
              onChange={(event) => setName(event.target.value)}
            />
          </label>
          <label className="block space-y-1 text-sm" htmlFor="me-bio">
            <span>О себе как о менторе</span>
            <Textarea
              id="me-bio"
              value={bioValue}
              onChange={(event) => setMentorBio(event.target.value)}
              maxLength={500}
            />
          </label>
          <fieldset className="space-y-3">
            <legend className="text-sm font-medium">Контакты</legend>
            <p className="text-muted-foreground text-sm leading-5">
              Необязательно. Напишите, где вам удобно общаться — чат на сайте
              появится позже.
            </p>
            {CONTACT_FIELDS.map((field) => (
              <label
                key={field.key}
                className="block space-y-1 text-sm"
                htmlFor={`me-${field.key}`}
              >
                <span>{field.label}</span>
                <Input
                  id={`me-${field.key}`}
                  value={contactValues[field.key] ?? ""}
                  onChange={(event) =>
                    setContacts((current) => ({
                      ...current,
                      [field.key]: event.target.value,
                    }))
                  }
                  placeholder={field.placeholder}
                />
              </label>
            ))}
          </fieldset>
          <Button type="submit" disabled={update.isPending}>
            Сохранить
          </Button>
        </form>
      </div>
    </AppShell>
  );
}
