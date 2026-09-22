import { IsOptional, IsString } from "class-validator";

export class ConnectGithubDto {
  @IsOptional()
  @IsString({ message: "Адрес возврата задан неверно" })
  next?: string;
}

export function safeNextPath(value: string | undefined) {
  const next = value?.trim();
  if (!next) {
    return null;
  }
  if (!next.startsWith("/") || next.startsWith("//")) {
    return null;
  }
  if (next.includes("://") || next.includes("\\")) {
    return null;
  }
  return next;
}
