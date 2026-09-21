import { IsEmail, IsString, MinLength } from "class-validator";

export class RegisterDto {
  @IsEmail({}, { message: "Укажите корректный email" })
  email: string;

  @IsString({ message: "Пароль должен быть строкой" })
  @MinLength(8, { message: "Пароль — минимум 8 символов" })
  password: string;

  @IsString({ message: "Имя должно быть строкой" })
  @MinLength(2, { message: "Имя — минимум 2 символа" })
  name: string;
}
