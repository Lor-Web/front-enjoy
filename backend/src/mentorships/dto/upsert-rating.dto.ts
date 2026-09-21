import { Type } from "class-transformer";
import {
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from "class-validator";

export class UpsertRatingDto {
  @IsIn(["asMentor", "asStudent"], { message: "Некорректный тип оценки" })
  aspect: "asMentor" | "asStudent";

  @Type(() => Number)
  @IsInt({ message: "Оценка должна быть целым числом" })
  @Min(1, { message: "Минимальная оценка — 1" })
  @Max(5, { message: "Максимальная оценка — 5" })
  score: number;

  @IsOptional()
  @IsString({ message: "Отзыв должен быть текстом" })
  @MaxLength(500, { message: "Отзыв — максимум 500 символов" })
  comment?: string;
}
