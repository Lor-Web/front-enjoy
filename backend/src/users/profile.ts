import { RatingAspect } from "@prisma/client";
import type { PrismaService } from "../prisma/prisma.service";
import { parseContacts, type UserContacts } from "./contacts";

export type RatingSummary = {
  average: number | null;
  count: number;
};

export type PublicProfile = {
  id: string;
  name: string;
  slug: string;
  contacts: UserContacts;
  mentorOffered: boolean;
  mentorBio: string | null;
  mentorRating: RatingSummary;
  studentRating: RatingSummary;
};

export type MeProfile = PublicProfile & {
  email: string;
};

async function ratingSummary(
  prisma: PrismaService,
  userId: string,
  aspect: RatingAspect,
): Promise<RatingSummary> {
  const result = await prisma.rating.aggregate({
    where: { toUserId: userId, aspect },
    _avg: { score: true },
    _count: true,
  });
  const average = result._avg.score;
  return {
    average: average === null ? null : Math.round(average * 10) / 10,
    count: result._count,
  };
}

export async function toPublicProfile(
  prisma: PrismaService,
  user: {
    id: string;
    name: string;
    slug: string;
    contacts: unknown;
    mentorOffered: boolean;
    mentorBio: string | null;
  },
): Promise<PublicProfile> {
  const [mentorRating, studentRating] = await Promise.all([
    ratingSummary(prisma, user.id, RatingAspect.asMentor),
    ratingSummary(prisma, user.id, RatingAspect.asStudent),
  ]);
  return {
    id: user.id,
    name: user.name,
    slug: user.slug,
    contacts: parseContacts(user.contacts),
    mentorOffered: user.mentorOffered,
    mentorBio: user.mentorBio,
    mentorRating,
    studentRating,
  };
}
