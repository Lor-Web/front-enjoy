import { Body, Controller, Get, Put, UseGuards } from "@nestjs/common";
import { CurrentUser } from "../auth/current-user.decorator";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { UpsertProgressDto } from "./dto/upsert-progress.dto";
import { ProgressService } from "./progress.service";

@Controller("progress")
@UseGuards(JwtAuthGuard)
export class ProgressController {
  constructor(private readonly progress: ProgressService) {}

  @Get("me")
  get(@CurrentUser() user: { id: string }) {
    return this.progress.get(user.id);
  }

  @Put("me")
  merge(@CurrentUser() user: { id: string }, @Body() dto: UpsertProgressDto) {
    return this.progress.merge(user.id, dto);
  }
}
