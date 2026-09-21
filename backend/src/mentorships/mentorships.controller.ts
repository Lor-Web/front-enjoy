import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { CurrentUser } from "../auth/current-user.decorator";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { CreateMentorshipDto } from "./dto/create-mentorship.dto";
import { UpsertRatingDto } from "./dto/upsert-rating.dto";
import { MentorshipsService } from "./mentorships.service";

@Controller("mentorships")
@UseGuards(JwtAuthGuard)
export class MentorshipsController {
  constructor(private readonly mentorships: MentorshipsService) {}

  @Post()
  request(
    @CurrentUser() user: { id: string },
    @Body() dto: CreateMentorshipDto,
  ) {
    return this.mentorships.request(user.id, dto);
  }

  @Get("incoming")
  incoming(@CurrentUser() user: { id: string }) {
    return this.mentorships.incoming(user.id);
  }

  @Get("students")
  students(@CurrentUser() user: { id: string }) {
    return this.mentorships.students(user.id);
  }

  @Get("mentors")
  mentors(@CurrentUser() user: { id: string }) {
    return this.mentorships.mentors(user.id);
  }

  @Get(":id")
  getOne(@CurrentUser() user: { id: string }, @Param("id") id: string) {
    return this.mentorships.getOne(user.id, id);
  }

  @Post(":id/accept")
  accept(@CurrentUser() user: { id: string }, @Param("id") id: string) {
    return this.mentorships.accept(user.id, id);
  }

  @Post(":id/decline")
  decline(@CurrentUser() user: { id: string }, @Param("id") id: string) {
    return this.mentorships.decline(user.id, id);
  }

  @Post(":id/end")
  end(@CurrentUser() user: { id: string }, @Param("id") id: string) {
    return this.mentorships.end(user.id, id);
  }

  @Post(":id/ratings")
  rate(
    @CurrentUser() user: { id: string },
    @Param("id") id: string,
    @Body() dto: UpsertRatingDto,
  ) {
    return this.mentorships.rate(user.id, id, dto);
  }
}
