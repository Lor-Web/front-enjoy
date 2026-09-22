import { BadRequestException, Injectable } from "@nestjs/common";
import type { AuthUser } from "../auth/current-user.decorator";
import { PrismaService } from "../prisma/prisma.service";
import type { VoteContentDto } from "./dto/vote-content.dto";

const VOTER_ID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

@Injectable()
export class VotesService {
  constructor(private readonly prisma: PrismaService) {}

  summary(targetId: string, voterKey: string | null) {
    return this.load(targetId, voterKey);
  }

  async vote(targetId: string, vote: VoteContentDto["vote"], voterKey: string) {
    const existing = await this.prisma.contentVote.findUnique({
      where: { targetId_voterKey: { targetId, voterKey } },
    });

    if (existing?.vote === vote) {
      await this.prisma.contentVote.delete({ where: { id: existing.id } });
    } else if (existing) {
      await this.prisma.contentVote.update({
        where: { id: existing.id },
        data: { vote },
      });
    } else {
      await this.prisma.contentVote.create({
        data: { targetId, voterKey, vote },
      });
    }

    return this.load(targetId, voterKey);
  }

  private async load(targetId: string, voterKey: string | null) {
    const [up, down, mine] = await Promise.all([
      this.prisma.contentVote.count({ where: { targetId, vote: "up" } }),
      this.prisma.contentVote.count({ where: { targetId, vote: "down" } }),
      voterKey
        ? this.prisma.contentVote.findUnique({
            where: { targetId_voterKey: { targetId, voterKey } },
          })
        : Promise.resolve(null),
    ]);
    return {
      up,
      down,
      mine: mine?.vote,
    };
  }
}

export function voterKeyFrom(
  user: AuthUser | undefined,
  header: string | string[] | undefined,
): string | null;
export function voterKeyFrom(
  user: AuthUser | undefined,
  header: string | string[] | undefined,
  required: true,
): string;
export function voterKeyFrom(
  user: AuthUser | undefined,
  header: string | string[] | undefined,
  required = false,
) {
  if (user?.id) {
    return `user:${user.id}`;
  }
  const raw = Array.isArray(header) ? header[0] : header;
  const voter = raw?.trim() ?? "";
  if (VOTER_ID.test(voter)) {
    return `anon:${voter.toLowerCase()}`;
  }
  if (required) {
    throw new BadRequestException("Не удалось сохранить голос");
  }
  return null;
}
