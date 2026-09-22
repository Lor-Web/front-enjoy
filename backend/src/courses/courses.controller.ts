import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { CurrentUser } from "../auth/current-user.decorator";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { CoursesService } from "./courses.service";
import { SubmitHomeworkDto } from "./dto/submit-homework.dto";

@Controller("courses")
export class CoursesController {
  constructor(private readonly courses: CoursesService) {}

  @Get(":slug/repository")
  @UseGuards(JwtAuthGuard)
  getRepository(
    @CurrentUser() user: { id: string },
    @Param("slug") slug: string,
  ) {
    return this.courses.getRepository(user.id, slug);
  }

  @Post(":slug/repository")
  @UseGuards(JwtAuthGuard)
  createRepository(
    @CurrentUser() user: { id: string },
    @Param("slug") slug: string,
  ) {
    return this.courses.createRepository(user.id, slug);
  }

  @Get(":slug/modules/:moduleSlug/homework")
  @UseGuards(JwtAuthGuard)
  getHomework(
    @CurrentUser() user: { id: string },
    @Param("slug") slug: string,
    @Param("moduleSlug") moduleSlug: string,
  ) {
    return this.courses.getHomework(user.id, slug, moduleSlug);
  }

  @Post(":slug/modules/:moduleSlug/homework")
  @UseGuards(JwtAuthGuard)
  submitHomework(
    @CurrentUser() user: { id: string },
    @Param("slug") slug: string,
    @Param("moduleSlug") moduleSlug: string,
    @Body() dto: SubmitHomeworkDto,
  ) {
    return this.courses.submitHomework(
      user.id,
      slug,
      moduleSlug,
      dto.prUrl,
      dto.mentorId,
    );
  }
}
