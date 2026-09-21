import {
  type CanActivate,
  type ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import type { Request } from "express";
import type { AuthUser } from "./current-user.decorator";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context
      .switchToHttp()
      .getRequest<Request & { user?: AuthUser }>();
    const header = request.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
      throw new UnauthorizedException("Нужно войти в аккаунт");
    }

    try {
      const payload = this.jwt.verify<{ sub: string }>(header.slice(7));
      request.user = { id: payload.sub };
      return true;
    } catch {
      throw new UnauthorizedException("Сессия истекла, войдите снова");
    }
  }
}
