import { IsOptional, IsString, MinLength } from "class-validator";

export class SubmitHomeworkDto {
  @IsString({ message: "Вставьте ссылку на pull request" })
  @MinLength(20, { message: "Вставьте ссылку на pull request" })
  prUrl: string;

  @IsOptional()
  @IsString({ message: "Выберите ментора" })
  mentorId?: string;
}
