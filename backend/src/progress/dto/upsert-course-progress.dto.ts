import { Type } from "class-transformer";
import {
  ArrayMaxSize,
  IsArray,
  IsISO8601,
  IsObject,
  IsOptional,
  Matches,
} from "class-validator";

export class UpsertCourseProgressDto {
  @IsOptional()
  @IsISO8601({}, { message: "Дата старта задана неверно" })
  startedAt?: string;

  @IsOptional()
  @IsArray({ message: "Список разделов задан неверно" })
  @ArrayMaxSize(200, { message: "Слишком много разделов" })
  @Matches(/^[a-z0-9-]+\/[a-z0-9-]+$/, {
    each: true,
    message: "Некорректный раздел",
  })
  completed?: string[];

  @IsOptional()
  @IsObject({ message: "Ответы заданы неверно" })
  @Type(() => Object)
  answers?: Record<string, number[]>;
}
