import { Type } from "class-transformer";
import {
  ArrayMaxSize,
  IsArray,
  IsInt,
  IsOptional,
  Matches,
} from "class-validator";

export class CompleteCourseSectionDto {
  @Matches(/^[a-z0-9-]+$/, { message: "Некорректный модуль" })
  moduleSlug: string;

  @Matches(/^[a-z0-9-]+$/, { message: "Некорректный раздел" })
  sectionSlug: string;

  @IsOptional()
  @IsArray({ message: "Ответы заданы неверно" })
  @ArrayMaxSize(40, { message: "Слишком много ответов" })
  @Type(() => Number)
  @IsInt({ each: true, message: "Ответы заданы неверно" })
  answers?: number[];
}
