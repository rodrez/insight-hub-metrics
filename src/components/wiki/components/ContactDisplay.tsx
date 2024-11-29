import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Contact } from "../types/contact";

interface ContactDisplayProps {
  contact: Contact;
  onDelete: (email: string) => void;
}

export function ContactDisplay({ contact, onDelete }: ContactDisplayProps) {
  return (
    <div className="p-4 border rounded-lg space-y-2">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <p className="font-medium">{contact.name}</p>
          <p className="text-sm text-muted-foreground">{contact.role}</p>
          <p className="text-sm">{contact.email}</p>
          {contact.phone && <p className="text-sm text-muted-foreground">{contact.phone}</p>}
          {contact.notes && (
            <p className="text-sm text-muted-foreground mt-2 italic">
              {contact.notes}
            </p>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(contact.email)}
        >
          <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
      </div>
    </div>
  );
}