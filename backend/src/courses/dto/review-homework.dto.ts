import { IsIn } from "class-validator";

export class ReviewHomeworkDto {
  @IsIn(["accepted", "rejected"], {
    message: "Можно принять или отклонить работу",
  })
  decision: "accepted" | "rejected";
}
