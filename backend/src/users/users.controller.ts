import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from "@nestjs/common";
import { CurrentUser } from "../auth/current-user.decorator";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { ListUsersQueryDto } from "./dto/list-users-query.dto";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { UsersService } from "./users.service";

@Controller()
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get("users")
  list(@Query() query: ListUsersQueryDto) {
    return this.users.list(query);
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
