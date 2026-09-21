import { IsEmail, IsString, MinLength } from "class-validator";

export class LoginDto {
  @IsEmail({}, { message: "Укажите корректный email" })
  email: string;

  @IsString({ message: "Пароль должен быть строкой" })
  @MinLength(8, { message: "Пароль — минимум 8 символов" })
  password: string;
}
