import { Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { CurrentUser } from "../auth/current-user.decorator";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { CoursesService } from "./courses.service";

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
}
