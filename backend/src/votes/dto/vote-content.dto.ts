import { IsIn, IsString, Matches } from "class-validator";

export const CONTENT_TARGET_ID =
  /^(lesson:[a-z0-9-]+:(short|detailed|practices)|quiz:[a-z0-9-]+)$/;

export class VoteQueryDto {
  @IsString({ message: "Укажите материал" })
  @Matches(CONTENT_TARGET_ID, {
    message: "Некорректный идентификатор материала",
  })
  targetId: string;
}

export class VoteContentDto extends VoteQueryDto {
  @IsIn(["up", "down"], {
    message: "Голос должен быть «нравится» или «не нравится»",
  })
  vote: "up" | "down";
}
