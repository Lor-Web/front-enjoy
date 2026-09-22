import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { GithubModule } from "../github/github.module";
import { CoursesController } from "./courses.controller";
import { CoursesService } from "./courses.service";

@Module({
  imports: [AuthModule, GithubModule],
  controllers: [CoursesController],
  providers: [CoursesService],
})
export class CoursesModule {}
