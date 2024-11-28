import { Mail } from "lucide-react";
import { ContactPerson } from "@/lib/types/collaboration";

type ContactInfoProps = {
  contact: ContactPerson;
};

export function ContactInfo({ contact }: ContactInfoProps) {
  return (
    <div className="space-y-2">
      <p className="font-medium">{contact.name}</p>
      <p className="text-sm text-muted-foreground">{contact.role}</p>
      <div className="flex flex-col gap-2">
        <a 
          href={`mailto:${contact.email}`}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <Mail className="h-4 w-4" />
          {contact.email}
        </a>
      </div>
    </div>
  );
}