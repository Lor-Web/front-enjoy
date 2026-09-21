import { useQuery } from "@tanstack/react-query";
import {
  mentorsQueryOptions,
  meQueryOptions,
  profileQueryOptions,
} from "./api/user-queries";

export { CONTACT_FIELDS } from "./lib/contacts";
export type {
  ContactKey,
  Mentorship,
  MentorshipRating,
  MentorshipStatus,
  MeProfile,
  PublicProfile,
  RatingAspect,
  RatingSummary,
  UserContacts,
} from "./model/types";
export { emptyContacts } from "./model/types";
export { ContactLinks } from "./ui/contact-links";
export { RatingLabel } from "./ui/rating-label";
export { mentorsQueryOptions, meQueryOptions, profileQueryOptions };

export function useMentors() {
  return useQuery(mentorsQueryOptions);
}

export function useProfile(slug: string) {
  return useQuery(profileQueryOptions(slug));
}
