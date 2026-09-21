import { Transform, Type } from "class-transformer";
import {
  IsBoolean,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from "class-validator";

export class ProfileContactsDto {
  @IsOptional()
  @IsString({ message: "Telegram должен быть строкой" })
  @MaxLength(120, { message: "Telegram слишком длинный" })
  telegram?: string;

  @IsOptional()
  @IsString({ message: "ВКонтакте должен быть строкой" })
  @MaxLength(120, { message: "ВКонтакте слишком длинный" })
  vk?: string;

  @IsOptional()
  @IsString({ message: "Discord должен быть строкой" })
  @MaxLength(120, { message: "Discord слишком длинный" })
  discord?: string;

  @IsOptional()
  @IsString({ message: "GitHub должен быть строкой" })
  @MaxLength(120, { message: "GitHub слишком длинный" })
  github?: string;
}

export class UpdateProfileDto {
  @IsOptional()
  @IsString({ message: "Имя должно быть строкой" })
  @MinLength(2, { message: "Имя — минимум 2 символа" })
  @MaxLength(80, { message: "Имя — максимум 80 символов" })
  name?: string;

  @IsOptional()
  @IsBoolean({ message: "Укажите, включён ли режим ментора" })
  mentorOffered?: boolean;

  @IsOptional()
  @IsString({ message: "Описание должно быть строкой" })
  @MaxLength(500, { message: "Описание — максимум 500 символов" })
  @Transform(({ value }) => (value === "" ? null : value))
  mentorBio?: string | null;

  @IsOptional()
  @ValidateNested()
  @Type(() => ProfileContactsDto)
  contacts?: ProfileContactsDto;
}
