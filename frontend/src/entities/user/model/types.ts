export type RatingSummary = {
  average: number | null;
  count: number;
};

export const CONTACT_KEYS = [
  "telegram",
  "vk",
  "discord",
  "github",
  "website",
] as const;

export type ContactKey = (typeof CONTACT_KEYS)[number];

export type UserContacts = Record<ContactKey, string | null>;

export const emptyContacts: UserContacts = {
  telegram: null,
  vk: null,
  discord: null,
  github: null,
  website: null,
};

export const GRADES = ["intern", "junior", "middle", "senior", "lead"] as const;

export type Grade = (typeof GRADES)[number];

export const VISIBILITY_KEYS = [
  "email",
  "grade",
  "experience",
  "workplace",
  "country",
  "city",
  "otherContacts",
  "mentorBio",
  "telegram",
  "vk",
  "discord",
  "github",
  "website",
] as const;

export type VisibilityKey = (typeof VISIBILITY_KEYS)[number];

export type ProfileVisibility = Record<VisibilityKey, boolean>;

export const defaultVisibility: ProfileVisibility = {
  email: false,
  grade: true,
  experience: true,
  workplace: true,
  country: true,
  city: true,
  otherContacts: true,
  mentorBio: true,
  telegram: true,
  vk: true,
  discord: true,
  github: true,
  website: true,
};

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
