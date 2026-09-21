import { zodResolver } from "@hookform/resolvers/zod";
import {
  Award,
  Briefcase,
  Building2,
  Mail,
  MapPin,
  Save,
  User,
} from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  CONTACT_FIELDS,
  contactIcons,
  emptyContacts,
  GRADE_OPTIONS,
  type MeProfile,
  type ProfileFormValues,
  parseVisibility,
  profileFormSchema,
  type VisibilityKey,
} from "@/entities/user";
import { useUpdateProfile } from "@/features/offer-mentoring";
import { Button } from "@/shared/ui/button";
import { Field, fieldDescribedBy, fieldError } from "@/shared/ui/field";
import { Input } from "@/shared/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { Textarea } from "@/shared/ui/textarea";
import { VisibilityToggle } from "@/shared/ui/visibility-toggle";

type ProfileFormProps = {
  me: MeProfile;
};

export function ProfileForm({ me }: ProfileFormProps) {
  const update = useUpdateProfile();
  const [visibility, setVisibility] = useState(parseVisibility(me.visibility));
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    mode: "onTouched",
    defaultValues: {
      name: me.name,
      mentorBio: me.mentorBio ?? "",
      grade: me.grade ?? "",
      experience: me.experience ?? "",
      workplace: me.workplace ?? "",
      country: me.country ?? "",
      city: me.city ?? "",
      otherContacts: me.otherContacts ?? "",
      contacts: {
        telegram: me.contacts.telegram ?? emptyContacts.telegram ?? "",
        vk: me.contacts.vk ?? "",
        discord: me.contacts.discord ?? "",
        github: me.contacts.github ?? "",
        website: me.contacts.website ?? "",
      },
    },
  });

  function setVisible(key: VisibilityKey, value: boolean) {
    setVisibility((current) => ({ ...current, [key]: value }));
  }

  return (
    <form
      className="space-y-8"
      noValidate
      onSubmit={handleSubmit((values) => {
        update.mutate({
          name: values.name,
          mentorBio: values.mentorBio,
          grade: values.grade || null,
          experience: values.experience,
          workplace: values.workplace,
          country: values.country,
          city: values.city,
          otherContacts: values.otherContacts,
          contacts: values.contacts,
          visibility,
        });
      })}
    >
      <section className="space-y-4">
        <h2 className="text-lg font-medium">О себе</h2>
        <Field
          id="me-name"
          label="Имя"
          required
          error={fieldError(errors.name)}
          hint="Видно всем"
        >
          <Input
            id="me-name"
            icon={User}
            placeholder="Как к вам обращаться"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={fieldDescribedBy(
              "me-name",
              fieldError(errors.name),
              "Видно всем",
            )}
            {...register("name")}
          />
        </Field>
        <Field
          id="me-email"
          label="Email"
          hint={
            visibility.email ? "Сейчас виден в профиле" : "По умолчанию скрыт"
          }
          visibility={
            <VisibilityToggle
              label="Email"
              visible={visibility.email}
              onChange={(value) => setVisible("email", value)}
            />
          }
        >
          <Input
            id="me-email"
            icon={Mail}
            value={me.email}
            readOnly
            placeholder="email@example.com"
          />
        </Field>
        <Field
          id="me-bio"
          label="О себе как о менторе"
          error={fieldError(errors.mentorBio)}
          hint="Коротко, чем можете помочь"
          visibility={
            <VisibilityToggle
              label="О себе как о менторе"
              visible={visibility.mentorBio}
              onChange={(value) => setVisible("mentorBio", value)}
            />
          }
        >
          <Textarea
            id="me-bio"
            maxLength={500}
            placeholder="Помогу разобраться с хуками и собеседованиями"
            aria-invalid={Boolean(errors.mentorBio)}
            aria-describedby={fieldDescribedBy(
              "me-bio",
              fieldError(errors.mentorBio),
              "Коротко, чем можете помочь",
            )}
            {...register("mentorBio")}
          />
        </Field>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-medium">Работа</h2>
        <Controller
          name="grade"
          control={control}
          render={({ field, fieldState }) => (
            <Field
              id="me-grade"
              label="Грейд"
              error={fieldError(fieldState.error)}
              visibility={
                <VisibilityToggle
                  label="Грейд"
                  visible={visibility.grade}
                  onChange={(value) => setVisible("grade", value)}
                />
              }
            >
              <div className="relative">
                <Award className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 z-10 size-4 -translate-y-1/2" />
                <Select
                  value={field.value || "none"}
                  onValueChange={(value) =>
                    field.onChange(value === "none" ? "" : value)
                  }
                  onOpenChange={(open) => {
                    if (!open) {
                      field.onBlur();
                    }
                  }}
                >
                  <SelectTrigger
                    id="me-grade"
                    className="pl-9"
                    aria-invalid={Boolean(fieldState.error)}
                  >
                    <SelectValue placeholder="Не указан" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Не указан</SelectItem>
                    {GRADE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </Field>
          )}
        />
        <Field
          id="me-experience"
          label="Опыт работы"
          error={fieldError(errors.experience)}
          hint="Например: 3 года во фронтенде"
          visibility={
            <VisibilityToggle
              label="Опыт работы"
              visible={visibility.experience}
              onChange={(value) => setVisible("experience", value)}
            />
          }
        >
          <Input
            id="me-experience"
            icon={Briefcase}
            placeholder="3 года"
            aria-invalid={Boolean(errors.experience)}
            aria-describedby={fieldDescribedBy(
              "me-experience",
              fieldError(errors.experience),
              "Например: 3 года во фронтенде",
            )}
            {...register("experience")}
          />
        </Field>
        <Field
          id="me-workplace"
          label="Место работы"
          error={fieldError(errors.workplace)}
          hint="Компания или «самозанятость»"
          visibility={
            <VisibilityToggle
              label="Место работы"
              visible={visibility.workplace}
              onChange={(value) => setVisible("workplace", value)}
            />
          }
        >
          <Input
            id="me-workplace"
            icon={Building2}
            placeholder="Яндекс или самозанятость"
            aria-invalid={Boolean(errors.workplace)}
            aria-describedby={fieldDescribedBy(
              "me-workplace",
              fieldError(errors.workplace),
              "Компания или «самозанятость»",
            )}
            {...register("workplace")}
          />
        </Field>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-medium">Где вы</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            id="me-country"
            label="Страна"
            error={fieldError(errors.country)}
            visibility={
              <VisibilityToggle
                label="Страна"
                visible={visibility.country}
                onChange={(value) => setVisible("country", value)}
              />
            }
          >
            <Input
              id="me-country"
              icon={MapPin}
              placeholder="Россия"
              aria-invalid={Boolean(errors.country)}
              aria-describedby={fieldDescribedBy(
                "me-country",
                fieldError(errors.country),
              )}
              {...register("country")}
            />
          </Field>
          <Field
            id="me-city"
            label="Город"
            error={fieldError(errors.city)}
            visibility={
              <VisibilityToggle
                label="Город"
                visible={visibility.city}
                onChange={(value) => setVisible("city", value)}
              />
            }
          >
            <Input
              id="me-city"
              icon={MapPin}
              placeholder="Москва"
              aria-invalid={Boolean(errors.city)}
              aria-describedby={fieldDescribedBy(
                "me-city",
                fieldError(errors.city),
              )}
              {...register("city")}
            />
          </Field>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-medium">Контакты</h2>
          <p className="text-muted-foreground mt-1 text-sm leading-5">
            Глаз рядом с полем показывает, видно ли его в публичном профиле. Чат
            на сайте появится позже.
          </p>
        </div>
        {CONTACT_FIELDS.map((field) => {
          const Icon = contactIcons[field.key];
          const error = fieldError(errors.contacts?.[field.key]);
          return (
            <Field
              key={field.key}
              id={`me-${field.key}`}
              label={field.label}
              error={error}
              hint={field.hint}
              visibility={
                <VisibilityToggle
                  label={field.label}
                  visible={visibility[field.key]}
                  onChange={(value) => setVisible(field.key, value)}
                />
              }
            >
              <Input
                id={`me-${field.key}`}
                icon={Icon}
                placeholder={field.placeholder}
                aria-invalid={Boolean(error)}
                aria-describedby={fieldDescribedBy(
                  `me-${field.key}`,
                  error,
                  field.hint,
                )}
                {...register(`contacts.${field.key}`)}
              />
            </Field>
          );
        })}
        <Field
          id="me-other"
          label="Другие контакты"
          error={fieldError(errors.otherContacts)}
          hint="WhatsApp, Max или как ещё удобно писать"
          visibility={
            <VisibilityToggle
              label="Другие контакты"
              visible={visibility.otherContacts}
              onChange={(value) => setVisible("otherContacts", value)}
            />
          }
        >
          <Textarea
            id="me-other"
            maxLength={300}
            placeholder="WhatsApp, Max, личный блог…"
            aria-invalid={Boolean(errors.otherContacts)}
            aria-describedby={fieldDescribedBy(
              "me-other",
              fieldError(errors.otherContacts),
              "WhatsApp, Max или как ещё удобно писать",
            )}
            {...register("otherContacts")}
          />
        </Field>
      </section>

      <Button type="submit" disabled={update.isPending}>
        <Save />
        Сохранить
      </Button>
    </form>
  );
}
