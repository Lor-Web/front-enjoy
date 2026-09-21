import { createParamDecorator, type ExecutionContext } from "@nestjs/common";

export type AuthUser = {
  id: string;
};

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): AuthUser => {
    return context.switchToHttp().getRequest<{ user: AuthUser }>().user;
  },
);
