import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module";
import { CoursesModule } from "./courses/courses.module";
import { GithubModule } from "./github/github.module";
import { MentorshipsModule } from "./mentorships/mentorships.module";
import { PrismaModule } from "./prisma/prisma.module";
import { ProgressModule } from "./progress/progress.module";
import { UsersModule } from "./users/users.module";
import { VotesModule } from "./votes/votes.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    MentorshipsModule,
    ProgressModule,
    VotesModule,
    GithubModule,
    CoursesModule,
  ],
})
export class AppModule {}
