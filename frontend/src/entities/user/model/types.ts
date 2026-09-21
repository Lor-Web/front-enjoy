export type RatingSummary = {
  average: number | null;
  count: number;
};

export const CONTACT_KEYS = ["telegram", "vk", "discord", "github"] as const;

export type ContactKey = (typeof CONTACT_KEYS)[number];

export type UserContacts = Record<ContactKey, string | null>;

export const emptyContacts: UserContacts = {
  telegram: null,
  vk: null,
  discord: null,
  github: null,
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

export type MentorshipStatus = "pending" | "active" | "declined" | "ended";
export type RatingAspect = "asMentor" | "asStudent";

export type MentorshipRating = {
  aspect: RatingAspect;
  score: number;
  comment: string | null;
  updatedAt: string;
};

export type Mentorship = {
  id: string;
  status: MentorshipStatus;
  startedAt: string | null;
  mentor: PublicProfile;
  student: PublicProfile;
  myRatings: MentorshipRating[];
};
