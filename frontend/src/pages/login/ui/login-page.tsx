import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useAuth } from "@/features/auth";
import { routes } from "@/shared/config/routes";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { AppShell } from "@/widgets/app-shell";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from =
    (location.state as { from?: string } | null)?.from ?? routes.cabinet;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
          onSubmit={(event) => {
            event.preventDefault();
            login.mutate(
              { email, password },
              { onSuccess: () => navigate(from, { replace: true }) },
            );
          }}
        >
          <label className="block space-y-1 text-sm" htmlFor="login-email">
            <span>Email</span>
            <Input
              id="login-email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
            />
          </label>
          <label className="block space-y-1 text-sm" htmlFor="login-password">
            <span>Пароль</span>
            <Input
              id="login-password"
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
            />
          </label>
          <Button type="submit" disabled={login.isPending}>
            Войти
          </Button>
        </form>
        <p className="text-muted-foreground mt-6 text-sm">
          Нет аккаунта?{" "}
          <Link to={routes.signup} className="text-primary hover:underline">
            Регистрация
          </Link>
        </p>
      </div>
    </AppShell>
  );
}
