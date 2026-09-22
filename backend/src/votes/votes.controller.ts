import {
  Body,
  Controller,
  Get,
  Headers,
  Put,
  Query,
  UseGuards,
} from "@nestjs/common";
import { type AuthUser, OptionalUser } from "../auth/current-user.decorator";
import { OptionalJwtAuthGuard } from "../auth/optional-jwt.guard";
import { VoteContentDto, VoteQueryDto } from "./dto/vote-content.dto";
import { VotesService, voterKeyFrom } from "./votes.service";

@Controller("content-votes")
@UseGuards(OptionalJwtAuthGuard)
export class VotesController {
  constructor(private readonly votes: VotesService) {}

  @Get()
  get(
    @Query() query: VoteQueryDto,
    @OptionalUser() user: AuthUser | undefined,
    @Headers("x-voter-id") voterId: string | undefined,
  ) {
    return this.votes.summary(query.targetId, voterKeyFrom(user, voterId));
  }

  @Put()
  vote(
    @Body() dto: VoteContentDto,
    @OptionalUser() user: AuthUser | undefined,
    @Headers("x-voter-id") voterId: string | undefined,
  ) {
    return this.votes.vote(
      dto.targetId,
      dto.vote,
      voterKeyFrom(user, voterId, true),
    );
  }
}
