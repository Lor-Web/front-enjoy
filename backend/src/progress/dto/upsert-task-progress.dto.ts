import { Type } from "class-transformer";
import {
  IsBoolean,
  IsInt,
  IsObject,
  IsOptional,
  Min,
  ValidateIf,
} from "class-validator";

export class UpsertTaskProgressDto {
  @IsOptional()
  @ValidateIf((_, value) => value !== null)
  @IsObject({ message: "Код задачи задан неверно" })
  codes?: Record<string, string> | null;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: "Число попыток задано неверно" })
  @Min(0, { message: "Число попыток не может быть меньше нуля" })
  fails?: number;

  @IsOptional()
  @IsBoolean({ message: "Отметка о выполнении задана неверно" })
  done?: boolean;
}
