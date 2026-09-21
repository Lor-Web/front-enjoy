import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { MentorshipsController } from "./mentorships.controller";
import { MentorshipsService } from "./mentorships.service";

@Module({
  imports: [AuthModule],
  controllers: [MentorshipsController],
  providers: [MentorshipsService],
  exports: [MentorshipsService],
})
export class MentorshipsModule {}
