import { Transform, Type } from "class-transformer";
import {
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from "class-validator";
import { GRADES } from "../details";

export class ListUsersQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: "Страница должна быть числом" })
  @Min(1, { message: "Страница должна быть не меньше 1" })
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: "Размер страницы должен быть числом" })
  @Min(1, { message: "Размер страницы должен быть не меньше 1" })
  @Max(50, { message: "Размер страницы — максимум 50" })
  limit?: number;

  @IsOptional()
  @IsString({ message: "Поиск должен быть строкой" })
  @MaxLength(80, { message: "Поиск слишком длинный" })
  q?: string;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === true || value === "true" || value === "1") {
      return true;
    }
    if (value === false || value === "false" || value === "0") {
      return false;
    }
    return value;
  })
  @IsBoolean({ message: "Фильтр менторов должен быть да или нет" })
  mentors?: boolean;

  @IsOptional()
  @IsIn([...GRADES], { message: "Укажите грейд из списка" })
  grade?: (typeof GRADES)[number];
}
