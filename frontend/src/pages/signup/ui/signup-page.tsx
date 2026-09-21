import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "@/features/auth";
import { routes } from "@/shared/config/routes";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { AppShell } from "@/widgets/app-shell";

export function SignupPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
          onSubmit={(event) => {
            event.preventDefault();
            register.mutate(
              { name, email, password },
              { onSuccess: () => navigate(routes.me, { replace: true }) },
            );
          }}
        >
          <label className="block space-y-1 text-sm" htmlFor="signup-name">
            <span>Имя</span>
            <Input
              id="signup-name"
              required
              minLength={2}
              value={name}
              onChange={(event) => setName(event.target.value)}
              autoComplete="name"
            />
          </label>
          <label className="block space-y-1 text-sm" htmlFor="signup-email">
            <span>Email</span>
            <Input
              id="signup-email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
            />
          </label>
          <label className="block space-y-1 text-sm" htmlFor="signup-password">
            <span>Пароль, минимум 8 символов</span>
            <Input
              id="signup-password"
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="new-password"
            />
          </label>
          <Button type="submit" disabled={register.isPending}>
            Создать аккаунт
          </Button>
        </form>
        <p className="text-muted-foreground mt-6 text-sm">
          Уже есть аккаунт?{" "}
          <Link to={routes.login} className="text-primary hover:underline">
            Войти
          </Link>
        </p>
      </div>
    </AppShell>
  );
}
