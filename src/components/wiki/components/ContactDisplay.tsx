import { Button } from "@/components/ui/button";
import { Pen, Trash2 } from "lucide-react";
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
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-green-500 transition-colors"
          >
            <Pen className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(contact.email)}
            className="text-gray-400 hover:text-red-500 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}