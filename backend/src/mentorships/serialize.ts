import type { MentorshipStatus, Prisma, RatingAspect } from "@prisma/client";
import type { PrismaService } from "../prisma/prisma.service";
import { toPublicProfile } from "../users/profile";

const profileSelect = {
  id: true,
  name: true,
  slug: true,
  contacts: true,
  mentorOffered: true,
  mentorBio: true,
} as const;

export const mentorshipInclude = {
  mentor: { select: profileSelect },
  student: { select: profileSelect },
  ratings: true,
} as const;

type MentorshipRow = Prisma.MentorshipGetPayload<{
  include: typeof mentorshipInclude;
}>;

export async function serializeMentorship(
  prisma: PrismaService,
  row: MentorshipRow,
  viewerId?: string,
) {
  return {
    id: row.id,
    status: row.status as MentorshipStatus,
    startedAt: row.startedAt?.toISOString() ?? null,
    mentor: await toPublicProfile(prisma, row.mentor),
    student: await toPublicProfile(prisma, row.student),
    myRatings: viewerId
      ? row.ratings
          .filter((rating) => rating.fromUserId === viewerId)
          .map((rating) => ({
            aspect: rating.aspect as RatingAspect,
            score: rating.score,
            comment: rating.comment,
            updatedAt: rating.updatedAt.toISOString(),
          }))
      : [],
  };
}
