import { RatingAspect, type User } from "@prisma/client";
import type { PrismaService } from "../prisma/prisma.service";
import { parseContacts, type UserContacts } from "./contacts";
import { type Grade, isGrade } from "./details";
import {
  type ProfileVisibility,
  parseVisibility,
  type VisibilityKey,
} from "./visibility";

export type RatingSummary = {
  average: number | null;
  count: number;
};

export type ProfileView = "public" | "owner" | "connected";

export type PublicProfile = {
  id: string;
  name: string;
  slug: string;
  email: string | null;
  contacts: UserContacts;
  mentorOffered: boolean;
  mentorBio: string | null;
  grade: Grade | null;
  experience: string | null;
  workplace: string | null;
  country: string | null;
  city: string | null;
  otherContacts: string | null;
  mentorRating: RatingSummary;
  studentRating: RatingSummary;
};

export type MeProfile = PublicProfile & {
  email: string;
  visibility: ProfileVisibility;
};

export type ProfileUser = Pick<
  User,
  | "id"
  | "name"
  | "slug"
  | "email"
  | "contacts"
  | "mentorOffered"
  | "mentorBio"
  | "grade"
  | "experience"
  | "workplace"
  | "country"
  | "city"
  | "otherContacts"
  | "visibility"
>;

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

function visibleText(
  value: string | null,
  key: VisibilityKey,
  visibility: ProfileVisibility,
  view: ProfileView,
) {
  if (!value) {
    return null;
  }
  if (view === "owner") {
    return value;
  }
  if (view === "connected" && key === "otherContacts") {
    return value;
  }
  return visibility[key] ? value : null;
}

export async function toPublicProfile(
  prisma: PrismaService,
  user: ProfileUser,
  view: ProfileView = "public",
): Promise<PublicProfile> {
  const [mentorRating, studentRating] = await Promise.all([
    ratingSummary(prisma, user.id, RatingAspect.asMentor),
    ratingSummary(prisma, user.id, RatingAspect.asStudent),
  ]);
  const visibility = parseVisibility(user.visibility);
  const contacts = parseContacts(user.contacts);
  const showContact = (key: keyof UserContacts) =>
    Boolean(
      contacts[key] &&
        (view === "owner" ||
          view === "connected" ||
          visibility[key as VisibilityKey]),
    );

  return {
    id: user.id,
    name: user.name,
    slug: user.slug,
    email: view === "owner" || visibility.email ? user.email : null,
    contacts: {
      telegram: showContact("telegram") ? contacts.telegram : null,
      vk: showContact("vk") ? contacts.vk : null,
      discord: showContact("discord") ? contacts.discord : null,
      github: showContact("github") ? contacts.github : null,
      website: showContact("website") ? contacts.website : null,
    },
    mentorOffered: user.mentorOffered,
    mentorBio: visibleText(user.mentorBio, "mentorBio", visibility, view),
    grade:
      isGrade(user.grade) && (view === "owner" || visibility.grade)
        ? user.grade
        : null,
    experience: visibleText(user.experience, "experience", visibility, view),
    workplace: visibleText(user.workplace, "workplace", visibility, view),
    country: visibleText(user.country, "country", visibility, view),
    city: visibleText(user.city, "city", visibility, view),
    otherContacts: visibleText(
      user.otherContacts,
      "otherContacts",
      visibility,
      view,
    ),
    mentorRating,
    studentRating,
  };
}

export async function toMeProfile(
  prisma: PrismaService,
  user: ProfileUser,
): Promise<MeProfile> {
  const profile = await toPublicProfile(prisma, user, "owner");
  return {
    ...profile,
    email: user.email,
    visibility: parseVisibility(user.visibility),
  };
}
