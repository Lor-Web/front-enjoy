import { useQuery } from "@tanstack/react-query";
import {
  mentorsQueryOptions,
  meQueryOptions,
  profileQueryOptions,
} from "./api/user-queries";

export { CONTACT_FIELDS, contactError } from "./lib/contacts";
export {
  GRADE_OPTIONS,
  gradeLabel,
  parseVisibility,
} from "./lib/profile-fields";
export {
  type ProfileFormValues,
  profileFormSchema,
} from "./lib/profile-schema";
export type {
  ContactKey,
  Grade,
  Mentorship,
  MentorshipRating,
  MentorshipStatus,
  MeProfile,
  ProfileVisibility,
  PublicProfile,
  RatingAspect,
  RatingSummary,
  UserContacts,
  VisibilityKey,
} from "./model/types";
export { emptyContacts } from "./model/types";
export { contactIcons } from "./ui/brand-icons";
export { ContactLinks } from "./ui/contact-links";
export { GradeBadge } from "./ui/grade-badge";
export { ProfileFacts } from "./ui/profile-facts";
export { RatingLabel } from "./ui/rating-label";
export { mentorsQueryOptions, meQueryOptions, profileQueryOptions };

export function useMentors() {
  return useQuery(mentorsQueryOptions);
}

export function useProfile(slug: string) {
  return useQuery(profileQueryOptions(slug));
}
