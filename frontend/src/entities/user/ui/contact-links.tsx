import { Link2, Mail } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { listedContacts } from "../lib/contacts";
import type { UserContacts } from "../model/types";
import { contactIconClass, contactIcons } from "./brand-icons";

export { contactIcons } from "./brand-icons";

type ContactLinksProps = {
  contacts: UserContacts;
  email?: string | null;
  otherContacts?: string | null;
  className?: string;
};

export function ContactLinks({
  contacts,
  email,
  otherContacts,
  className,
}: ContactLinksProps) {
  const items = listedContacts(contacts);
  if (items.length === 0 && !email && !otherContacts) {
    return null;
  }

  return (
    <div className={cn("flex flex-col gap-2 text-sm", className)}>
      <div className="flex flex-wrap gap-x-4 gap-y-2">
        {email ? (
          <a
            href={`mailto:${email}`}
            className="text-primary inline-flex items-center gap-1.5 underline-offset-4 transition-colors hover:underline"
          >
            <Mail className="size-3.5 shrink-0" />
            {email}
          </a>
        ) : null}
        {items.map((item) => {
          const Icon = contactIcons[item.key];
          const content = (
            <>
              <Icon
                className={cn("size-3.5 shrink-0", contactIconClass[item.key])}
              />
              {item.caption}
            </>
          );
          return item.href ? (
            <a
              key={item.key}
              href={item.href}
              className="text-primary inline-flex items-center gap-1.5 underline-offset-4 transition-colors hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              {content}
            </a>
          ) : (
            <span
              key={item.key}
              className="text-muted-foreground inline-flex items-center gap-1.5"
            >
              {content}
            </span>
          );
        })}
      </div>
      {otherContacts ? (
        <p className="text-muted-foreground inline-flex items-start gap-1.5 whitespace-pre-wrap leading-6">
          <Link2 className="mt-1 size-3.5 shrink-0" />
          {otherContacts}
        </p>
      ) : null}
    </div>
  );
}
