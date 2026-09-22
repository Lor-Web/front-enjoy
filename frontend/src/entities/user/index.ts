import { useQuery } from "@tanstack/react-query";
import {
  profileQueryOptions,
  type UsersListParams,
  usersQueryOptions,
} from "./api/user-queries";

export {
  meQueryOptions,
  profileQueryOptions,
  type UsersListParams,
  type UsersListResponse,
  usersQueryOptions,
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
export { contactIcons, GitHubIcon } from "./ui/brand-icons";
export { ContactLinks } from "./ui/contact-links";
export { GradeBadge } from "./ui/grade-badge";
export { ProfileFacts } from "./ui/profile-facts";
export { RatingLabel } from "./ui/rating-label";

export function useUsers(params: UsersListParams) {
  return useQuery(usersQueryOptions(params));
}

export function useProfile(slug: string) {
  return useQuery(profileQueryOptions(slug));
}
