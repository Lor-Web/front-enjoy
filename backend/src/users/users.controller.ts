import { Body, Controller, Get, Param, Patch, UseGuards } from "@nestjs/common";
import { CurrentUser } from "../auth/current-user.decorator";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { UsersService } from "./users.service";

@Controller()
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get("mentors")
  listMentors() {
    return this.users.listMentors();
  }

  @Get("users/:slug")
  getBySlug(@Param("slug") slug: string) {
    return this.users.getBySlug(slug);
  }

  @Patch("users/me")
  @UseGuards(JwtAuthGuard)
  updateMe(@CurrentUser() user: { id: string }, @Body() dto: UpdateProfileDto) {
    return this.users.updateMe(user.id, dto);
  }
}
