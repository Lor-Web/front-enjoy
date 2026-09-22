import { Transform, Type } from "class-transformer";
import {
  IsBoolean,
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateIf,
  ValidateNested,
} from "class-validator";
import { GRADES } from "../details";

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
  @IsString({ message: "Сайт должен быть строкой" })
  @MaxLength(200, { message: "Сайт слишком длинный" })
  website?: string;
}

export class ProfileVisibilityDto {
  @IsOptional()
  @IsBoolean({ message: "Видимость email должна быть да или нет" })
  email?: boolean;

  @IsOptional()
  @IsBoolean({ message: "Видимость грейда должна быть да или нет" })
  grade?: boolean;

  @IsOptional()
  @IsBoolean({ message: "Видимость опыта должна быть да или нет" })
  experience?: boolean;

  @IsOptional()
  @IsBoolean({ message: "Видимость места работы должна быть да или нет" })
  workplace?: boolean;

  @IsOptional()
  @IsBoolean({ message: "Видимость страны должна быть да или нет" })
  country?: boolean;

  @IsOptional()
  @IsBoolean({ message: "Видимость города должна быть да или нет" })
  city?: boolean;

  @IsOptional()
  @IsBoolean({ message: "Видимость других контактов должна быть да или нет" })
  otherContacts?: boolean;

  @IsOptional()
  @IsBoolean({ message: "Видимость описания должна быть да или нет" })
  mentorBio?: boolean;

  @IsOptional()
  @IsBoolean({ message: "Видимость Telegram должна быть да или нет" })
  telegram?: boolean;

  @IsOptional()
  @IsBoolean({ message: "Видимость ВКонтакте должна быть да или нет" })
  vk?: boolean;

  @IsOptional()
  @IsBoolean({ message: "Видимость Discord должна быть да или нет" })
  discord?: boolean;

  @IsOptional()
  @IsBoolean({ message: "Видимость сайта должна быть да или нет" })
  website?: boolean;
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
  @Transform(({ value }) => (value === "" ? null : value))
  @ValidateIf((_, value) => value != null)
  @IsIn([...GRADES], { message: "Укажите грейд из списка" })
  grade?: string | null;

  @IsOptional()
  @IsString({ message: "Опыт работы должен быть строкой" })
  @MaxLength(80, { message: "Опыт работы — максимум 80 символов" })
  @Transform(({ value }) => (value === "" ? null : value))
  experience?: string | null;

  @IsOptional()
  @IsString({ message: "Место работы должно быть строкой" })
  @MaxLength(120, { message: "Место работы — максимум 120 символов" })
  @Transform(({ value }) => (value === "" ? null : value))
  workplace?: string | null;

  @IsOptional()
  @IsString({ message: "Страна должна быть строкой" })
  @MaxLength(80, { message: "Страна — максимум 80 символов" })
  @Transform(({ value }) => (value === "" ? null : value))
  country?: string | null;

  @IsOptional()
  @IsString({ message: "Город должен быть строкой" })
  @MaxLength(80, { message: "Город — максимум 80 символов" })
  @Transform(({ value }) => (value === "" ? null : value))
  city?: string | null;

  @IsOptional()
  @IsString({ message: "Другие контакты должны быть строкой" })
  @MaxLength(300, { message: "Другие контакты — максимум 300 символов" })
  @Transform(({ value }) => (value === "" ? null : value))
  otherContacts?: string | null;

  @IsOptional()
  @ValidateNested()
  @Type(() => ProfileContactsDto)
  contacts?: ProfileContactsDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => ProfileVisibilityDto)
  visibility?: ProfileVisibilityDto;
}
