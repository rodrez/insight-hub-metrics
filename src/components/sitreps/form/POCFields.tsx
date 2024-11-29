import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ContactForm } from "@/components/wiki/components/ContactForm";
import { ContactDisplay } from "@/components/wiki/components/ContactDisplay";
import { Contact } from "@/components/wiki/types/contact";
import { ScrollArea } from "@/components/ui/scroll-area";

interface POCFieldsProps {
  contacts: Contact[];
  onContactsChange: (contacts: Contact[]) => void;
}

export function POCFields({ contacts, onContactsChange }: POCFieldsProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newContact, setNewContact] = useState<Contact>({
    name: "",
    role: "",
    email: "",
    phone: "",
  });

  const handleAddContact = () => {
    if (newContact.name && newContact.email) {
      onContactsChange([...contacts, newContact]);
      setNewContact({
        name: "",
        role: "",
        email: "",
        phone: "",
      });
      setShowAddForm(false);
    }
  };

  const handleDeleteContact = (email: string) => {
    onContactsChange(contacts.filter(c => c.email !== email));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Points of Contact</h3>
        <Button 
          variant="outline" 
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? "Cancel" : "Add Contact"}
        </Button>
      </div>

      {showAddForm && (
        <div className="p-4 border rounded-lg">
          <ContactForm
            contact={newContact}
            onChange={setNewContact}
          />
          <div className="mt-4 flex justify-end">
            <Button onClick={handleAddContact}>Add Contact</Button>
          </div>
        </div>
      )}

      <ScrollArea className="h-[200px]">
        <div className="space-y-2">
          {contacts.map((contact, index) => (
            <ContactDisplay
              key={`${contact.email}-${index}`}
              contact={contact}
              onDelete={handleDeleteContact}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}