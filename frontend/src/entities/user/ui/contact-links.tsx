import { cn } from "@/shared/lib/utils";
import { listedContacts } from "../lib/contacts";
import type { UserContacts } from "../model/types";

type ContactLinksProps = {
  contacts: UserContacts;
  className?: string;
};

export function ContactLinks({ contacts, className }: ContactLinksProps) {
  const items = listedContacts(contacts);
  if (items.length === 0) {
    return null;
  }

  return (
    <div className={cn("flex flex-wrap gap-x-4 gap-y-1 text-sm", className)}>
      {items.map((item) => (
        <span key={item.key}>
          {item.href ? (
            <a
              href={item.href}
              className="text-primary hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              {item.label}
            </a>
          ) : (
            <span>
              <span className="text-muted-foreground">{item.label}: </span>
              {item.caption}
            </span>
          )}
        </span>
      ))}
    </div>
  );
}
