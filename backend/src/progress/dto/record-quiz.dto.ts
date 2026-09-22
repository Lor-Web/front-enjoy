import { IsBoolean } from "class-validator";

export class RecordQuizDto {
  @IsBoolean({ message: "Результат квиза задан неверно" })
  passed: boolean;
}
