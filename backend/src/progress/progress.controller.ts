import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from "@nestjs/common";
import { CurrentUser } from "../auth/current-user.decorator";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RecordQuizDto } from "./dto/record-quiz.dto";
import { UpsertTaskProgressDto } from "./dto/upsert-task-progress.dto";
import { ProgressService } from "./progress.service";

@Controller("progress")
@UseGuards(JwtAuthGuard)
export class ProgressController {
  constructor(private readonly progress: ProgressService) {}

  @Get("me")
  get(@CurrentUser() user: { id: string }) {
    return this.progress.get(user.id);
  }

  @Post("lessons/:slug")
  markRead(@CurrentUser() user: { id: string }, @Param("slug") slug: string) {
    return this.progress.markRead(user.id, slug);
  }

  @Post("quizzes/:slug")
  recordQuiz(
    @CurrentUser() user: { id: string },
    @Param("slug") slug: string,
    @Body() dto: RecordQuizDto,
  ) {
    return this.progress.recordQuiz(user.id, slug, dto.passed);
  }

  @Get("tasks/:slug")
  getTask(@CurrentUser() user: { id: string }, @Param("slug") slug: string) {
    return this.progress.getTask(user.id, slug);
  }

  @Put("tasks/:slug")
  upsertTask(
    @CurrentUser() user: { id: string },
    @Param("slug") slug: string,
    @Body() dto: UpsertTaskProgressDto,
  ) {
    return this.progress.upsertTask(user.id, slug, dto);
  }
}
