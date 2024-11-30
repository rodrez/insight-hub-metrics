import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Contact } from "../types/contact";

interface ContactFormProps {
  contact: Contact;
  onChange: (updatedContact: Contact) => void;
}

export function ContactForm({ contact, onChange }: ContactFormProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label htmlFor="newContactName">Name</Label>
        <Input
          id="newContactName"
          value={contact.name}
          onChange={(e) => onChange({ ...contact, name: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="newContactRole">Role</Label>
        <Input
          id="newContactRole"
          value={contact.role}
          onChange={(e) => onChange({ ...contact, role: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="newContactEmail">Email</Label>
        <Input
          id="newContactEmail"
          type="email"
          value={contact.email}
          onChange={(e) => onChange({ ...contact, email: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="newContactPhone">Phone</Label>
        <Input
          id="newContactPhone"
          value={contact.phone}
          onChange={(e) => onChange({ ...contact, phone: e.target.value })}
        />
      </div>
      <div className="col-span-2">
        <Label htmlFor="newContactNotes">Notes</Label>
        <Textarea
          id="newContactNotes"
          value={contact.notes || ""}
          onChange={(e) => onChange({ ...contact, notes: e.target.value })}
          placeholder="Add any additional notes about this contact..."
          className="h-20"
        />
      </div>
    </div>
  );
}