import { useAtomValue } from "jotai";
import { Link } from "react-router";
import { routes } from "@/shared/config/routes";
import { Button } from "@/shared/ui/button";
import { tokenAtom } from "../model/token-atom";
import { useLogout } from "../model/use-auth";
import { useMe } from "../model/use-me";

export function AuthMenu() {
  const token = useAtomValue(tokenAtom);
  const { data: me, isPending } = useMe();
  const logout = useLogout();

  if (token && isPending) {
    return <span className="text-muted-foreground text-sm">Загрузка…</span>;
  }

  if (!me) {
    return (
      <div className="flex items-center gap-2">
        <Button asChild variant="ghost" size="sm">
          <Link to={routes.login}>Войти</Link>
        </Button>
        <Button asChild size="sm" className="hidden sm:inline-flex">
          <Link to={routes.signup}>Регистрация</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button asChild variant="ghost" size="sm">
        <Link to={routes.cabinet}>Кабинет</Link>
      </Button>
      <Button asChild variant="ghost" size="sm">
        <Link to={routes.me}>{me.name}</Link>
      </Button>
      <Button type="button" variant="outline" size="sm" onClick={logout}>
        Выйти
      </Button>
    </div>
  );
}
