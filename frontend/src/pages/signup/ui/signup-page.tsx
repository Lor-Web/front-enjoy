import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Mail, User, UserPlus } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { type SignupValues, signupSchema, useAuth } from "@/features/auth";
import { routes } from "@/shared/config/routes";
import { Button } from "@/shared/ui/button";
import { Field, fieldDescribedBy, fieldError } from "@/shared/ui/field";
import { Input } from "@/shared/ui/input";
import { AppShell } from "@/widgets/app-shell";

export function SignupPage() {
  const { register: signUp } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    mode: "onTouched",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      passwordConfirm: "",
    },
  });

  return (
    <AppShell>
      <div className="mx-auto max-w-md">
        <h1 className="mb-2 text-3xl">Регистрация</h1>
        <p className="text-muted-foreground mb-6 text-sm leading-6">
          Один аккаунт — и ученик, и ментор. Принимать учеников можно позже в
          профиле.
        </p>
        <form
          className="space-y-4"
          noValidate
          onSubmit={handleSubmit((values) => {
            signUp.mutate(
              {
                name: values.name,
                email: values.email,
                password: values.password,
              },
              { onSuccess: () => navigate(routes.me, { replace: true }) },
            );
          })}
        >
          <Field
            id="signup-name"
            label="Имя"
            required
            error={fieldError(errors.name)}
            hint="Как к вам обращаться"
          >
            <Input
              id="signup-name"
              icon={User}
              autoComplete="name"
              placeholder="Анна"
              aria-invalid={Boolean(errors.name)}
              aria-describedby={fieldDescribedBy(
                "signup-name",
                fieldError(errors.name),
                "Как к вам обращаться",
              )}
              {...register("name")}
            />
          </Field>
          <Field
            id="signup-email"
            label="Email"
            required
            error={fieldError(errors.email)}
            hint="Нужен для входа"
          >
            <Input
              id="signup-email"
              icon={Mail}
              type="email"
              autoComplete="email"
              placeholder="anna@example.com"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={fieldDescribedBy(
                "signup-email",
                fieldError(errors.email),
                "Нужен для входа",
              )}
              {...register("email")}
            />
          </Field>
          <Field
            id="signup-password"
            label="Пароль"
            required
            error={fieldError(errors.password)}
            hint="Минимум 8 символов"
          >
            <Input
              id="signup-password"
              icon={Lock}
              type="password"
              autoComplete="new-password"
              placeholder="Минимум 8 символов"
              aria-invalid={Boolean(errors.password)}
              aria-describedby={fieldDescribedBy(
                "signup-password",
                fieldError(errors.password),
                "Минимум 8 символов",
              )}
              {...register("password")}
            />
          </Field>
          <Field
            id="signup-password-confirm"
            label="Повторите пароль"
            required
            error={fieldError(errors.passwordConfirm)}
          >
            <Input
              id="signup-password-confirm"
              icon={Lock}
              type="password"
              autoComplete="new-password"
              placeholder="Ещё раз тот же пароль"
              aria-invalid={Boolean(errors.passwordConfirm)}
              aria-describedby={fieldDescribedBy(
                "signup-password-confirm",
                fieldError(errors.passwordConfirm),
              )}
              {...register("passwordConfirm")}
            />
          </Field>
          <Button type="submit" disabled={signUp.isPending}>
            <UserPlus />
            Создать аккаунт
          </Button>
        </form>
        <p className="text-muted-foreground mt-6 text-sm">
          Уже есть аккаунт?{" "}
          <Link
            to={routes.login}
            className="text-primary underline-offset-4 transition-colors hover:underline"
          >
            Войти
          </Link>
        </p>
      </div>
    </AppShell>
  );
}
