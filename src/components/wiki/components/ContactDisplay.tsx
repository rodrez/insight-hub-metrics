import { Button } from "@/components/ui/button";
import { Pen, Trash2 } from "lucide-react";
import { Contact } from "../types/contact";

interface ContactDisplayProps {
  contact: Contact;
  onDelete: (email: string) => void;
}

export function ContactDisplay({ contact, onDelete }: ContactDisplayProps) {
  return (
    <div 
      className="p-4 border rounded-lg space-y-2"
      role="article"
      aria-label={`Contact information for ${contact.name}`}
    >
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <p className="font-medium">{contact.name}</p>
          <p className="text-sm text-muted-foreground">{contact.role}</p>
          <p className="text-sm">
            <a 
              href={`mailto:${contact.email}`}
              className="text-blue-500 hover:underline"
              aria-label={`Send email to ${contact.name} at ${contact.email}`}
            >
              {contact.email}
            </a>
          </p>
          {contact.phone && (
            <p className="text-sm text-muted-foreground">
              <a 
                href={`tel:${contact.phone}`}
                aria-label={`Call ${contact.name} at ${contact.phone}`}
              >
                {contact.phone}
              </a>
            </p>
          )}
          {contact.notes && (
            <p 
              className="text-sm text-muted-foreground mt-2 italic"
              aria-label="Additional notes"
            >
              {contact.notes}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-green-500 transition-colors"
            aria-label={`Edit ${contact.name}'s information`}
          >
            <Pen className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(contact.email)}
            className="text-gray-400 hover:text-red-500 transition-colors"
            aria-label={`Delete ${contact.name}'s contact information`}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}