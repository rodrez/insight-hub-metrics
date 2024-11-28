import { Mail, Phone } from "lucide-react";

type ContactInfo = {
  name: string;
  role: string;
  email: string;
  phone?: string;
};

type CollaboratorContactProps = {
  contact?: ContactInfo;
};

export function CollaboratorContact({ contact }: CollaboratorContactProps) {
  if (!contact) {
    return (
      <div>
        <h4 className="font-medium mb-2">Primary Contact</h4>
        <p className="text-sm text-muted-foreground">No primary contact set</p>
      </div>
    );
  }

  return (
    <div>
      <h4 className="font-medium mb-2">Primary Contact</h4>
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
          {contact.phone && (
            <a 
              href={`tel:${contact.phone}`}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <Phone className="h-4 w-4" />
              {contact.phone}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}