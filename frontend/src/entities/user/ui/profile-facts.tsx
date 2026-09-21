import { Briefcase, Building2, MapPin } from "lucide-react";
import type { PublicProfile } from "../model/types";
import { GradeBadge } from "./grade-badge";

type ProfileFactsProps = {
  profile: PublicProfile;
};

export function ProfileFacts({ profile }: ProfileFactsProps) {
  const location = [profile.city, profile.country].filter(Boolean).join(", ");
  const items: Array<{ key: string; icon: typeof Briefcase; content: string }> =
    [];

  if (profile.experience) {
    items.push({
      key: "experience",
      icon: Briefcase,
      content: profile.experience,
    });
  }
  if (profile.workplace) {
    items.push({
      key: "workplace",
      icon: Building2,
      content: profile.workplace,
    });
  }
  if (location) {
    items.push({ key: "location", icon: MapPin, content: location });
  }

  if (!profile.grade && items.length === 0) {
    return null;
  }

  return (
    <ul className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
      {profile.grade ? (
        <li>
          <GradeBadge grade={profile.grade} />
        </li>
      ) : null}
      {items.map((item) => (
        <li
          key={item.key}
          className="text-muted-foreground flex items-center gap-2"
        >
          <item.icon className="text-foreground/70 size-4 shrink-0" />
          <span>{item.content}</span>
        </li>
      ))}
    </ul>
  );
}
