import { IsArray, IsObject, IsString } from "class-validator";

export class UpsertProgressDto {
  @IsArray({ message: "Список уроков задан неверно" })
  @IsString({ each: true, message: "Идентификатор урока должен быть строкой" })
  readLessonIds: string[];

  @IsArray({ message: "Список квизов задан неверно" })
  @IsString({ each: true, message: "Идентификатор квиза должен быть строкой" })
  passedQuizIds: string[];

  @IsObject({ message: "Попытки квизов заданы неверно" })
  quizAttempts: Record<string, number>;
}
