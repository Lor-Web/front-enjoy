import { IsString, MinLength } from "class-validator";

export class CreateMentorshipDto {
  @IsString({ message: "Укажите ментора" })
  @MinLength(1, { message: "Укажите ментора" })
  mentorSlug: string;
}
