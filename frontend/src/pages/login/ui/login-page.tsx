import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, LogIn, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router";
import { type LoginValues, loginSchema, useAuth } from "@/features/auth";
import { routes } from "@/shared/config/routes";
import { Button } from "@/shared/ui/button";
import { Field, fieldDescribedBy, fieldError } from "@/shared/ui/field";
import { Input } from "@/shared/ui/input";
import { AppShell } from "@/widgets/app-shell";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from =
    (location.state as { from?: string } | null)?.from ?? routes.cabinet;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
    defaultValues: { email: "", password: "" },
  });

  return (
    <AppShell>
      <div className="mx-auto max-w-md">
        <h1 className="mb-2 text-3xl">Вход</h1>
        <p className="text-muted-foreground mb-6 text-sm leading-6">
          Уроки можно читать без аккаунта. Вход нужен, чтобы найти ментора или
          принимать учеников.
        </p>
        <form
          className="space-y-4"
          noValidate
          onSubmit={handleSubmit((values) => {
            login.mutate(values, {
              onSuccess: () => navigate(from, { replace: true }),
            });
          })}
        >
          <Field
            id="login-email"
            label="Email"
            required
            error={fieldError(errors.email)}
          >
            <Input
              id="login-email"
              icon={Mail}
              type="email"
              autoComplete="email"
              placeholder="anna@example.com"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={fieldDescribedBy(
                "login-email",
                fieldError(errors.email),
              )}
              {...register("email")}
            />
          </Field>
          <Field
            id="login-password"
            label="Пароль"
            required
            error={fieldError(errors.password)}
          >
            <Input
              id="login-password"
              icon={Lock}
              type="password"
              autoComplete="current-password"
              placeholder="Ваш пароль"
              aria-invalid={Boolean(errors.password)}
              aria-describedby={fieldDescribedBy(
                "login-password",
                fieldError(errors.password),
              )}
              {...register("password")}
            />
          </Field>
          <Button type="submit" disabled={login.isPending}>
            <LogIn />
            Войти
          </Button>
        </form>
        <p className="text-muted-foreground mt-6 text-sm">
          Нет аккаунта?{" "}
          <Link
            to={routes.signup}
            className="text-primary underline-offset-4 transition-colors hover:underline"
          >
            Регистрация
          </Link>
        </p>
      </div>
    </AppShell>
  );
}
