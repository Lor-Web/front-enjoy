import { IsString, MinLength } from "class-validator";

export class SubmitHomeworkDto {
  @IsString({ message: "Вставьте ссылку на pull request" })
  @MinLength(20, { message: "Вставьте ссылку на pull request" })
  prUrl: string;

  @IsString({ message: "Выберите ментора" })
  @MinLength(1, { message: "Выберите ментора" })
  mentorId: string;
}
