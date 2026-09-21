import { Link, useParams } from "react-router";
import {
  ContactLinks,
  ProfileFacts,
  RatingLabel,
  useProfile,
} from "@/entities/user";
import { useMe } from "@/features/auth";
import { RequestMentorshipButton } from "@/features/request-mentorship";
import { routes } from "@/shared/config/routes";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { AppShell } from "@/widgets/app-shell";

export function ProfilePage() {
  const { slug = "" } = useParams();
  const { data: profile, isPending, isError } = useProfile(slug);
  const { data: me } = useMe();

  if (isPending) {
    return (
      <AppShell>
        <p className="text-muted-foreground">Загрузка…</p>
      </AppShell>
    );
  }

  if (isError || !profile) {
    return (
      <AppShell>
        <p>Профиль не найден.</p>
        <Button asChild variant="link" className="px-0">
          <Link to={routes.mentors}>К каталогу менторов</Link>
        </Button>
      </AppShell>
    );
  }

  const isSelf = me?.id === profile.id;

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <h1 className="text-3xl sm:text-4xl">{profile.name}</h1>
          {profile.mentorOffered ? <Badge>Ментор</Badge> : null}
        </div>
        <div className="mb-8 grid gap-5 sm:grid-cols-2">
          <RatingLabel label="Как ментор" rating={profile.mentorRating} />
          <RatingLabel label="Как ученик" rating={profile.studentRating} />
        </div>
        <ProfileFacts profile={profile} />
        {profile.mentorBio ? (
          <p className="mb-6 text-[17px] leading-7">{profile.mentorBio}</p>
        ) : null}
        <ContactLinks
          className="mb-8"
          contacts={profile.contacts}
          email={profile.email}
          otherContacts={profile.otherContacts}
        />
        {isSelf ? (
          <Button asChild>
            <Link to={routes.me}>Редактировать профиль</Link>
          </Button>
        ) : profile.mentorOffered ? (
          <RequestMentorshipButton
            mentorSlug={profile.slug}
            loggedIn={Boolean(me)}
          />
        ) : null}
      </div>
    </AppShell>
  );
}
