import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { toast } from "../ui/use-toast";
import { Contact } from "./types/contact";
import { ContactForm } from "./components/ContactForm";
import { ContactDisplay } from "./components/ContactDisplay";
import { LOBDisplay } from "./components/LOBDisplay";
import { Button } from "@/components/ui/button";

interface LOBCardProps {
  lob: { name: string; department: string; };
  category: { 
    name: string; 
    detailedDescription?: string;
    contacts: Contact[];
  };
  onUpdate: (updatedLob: { name: string; department: string; }) => void;
  onDelete: (lob: { name: string; department: string; }) => void;
}

export function LOBCard({ lob, category, onUpdate, onDelete }: LOBCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(lob.name);
  const [editedDescription, setEditedDescription] = useState(category.detailedDescription || '');
  const [contacts, setContacts] = useState<Contact[]>(category.contacts);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [newContact, setNewContact] = useState<Contact>({
    name: '',
    role: '',
    email: '',
    phone: '',
    notes: ''
  });

  const handleSave = () => {
    if (!editedName.trim()) {
      toast({
        title: "Error",
        description: "Name cannot be empty",
        variant: "destructive"
      });
      return;
    }

    const updatedLob = {
      ...lob,
      name: editedName.trim()
    };

    onUpdate(updatedLob);
    setIsEditing(false);
    toast({
      title: "Success",
      description: "LOB updated successfully"
    });
  };

  const handleAddContact = () => {
    if (!newContact.name || !newContact.email || !newContact.role) {
      toast({
        title: "Error",
        description: "Name, email, and role are required",
        variant: "destructive"
      });
      return;
    }

    setContacts([...contacts, { ...newContact }]);
    setNewContact({
      name: '',
      role: '',
      email: '',
      phone: '',
      notes: ''
    });
  };

  const handleEditContact = (contact: Contact) => {
    setEditingContact(contact);
    setNewContact(contact);
  };

  const handleUpdateContact = () => {
    if (editingContact) {
      setContacts(contacts.map(c => 
        c.email === editingContact.email ? newContact : c
      ));
      setEditingContact(null);
      setNewContact({
        name: '',
        role: '',
        email: '',
        phone: '',
        notes: ''
      });
      toast({
        title: "Success",
        description: "Contact updated successfully"
      });
    }
  };

  const handleDeleteContact = (email: string) => {
    setContacts(contacts.filter(contact => contact.email !== email));
  };

  const handleDelete = () => {
    onDelete(lob);
    toast({
      title: "Success",
      description: "LOB deleted successfully"
    });
  };

  return (
    <>
      <LOBDisplay 
        lob={lob}
        category={category}
        onEdit={() => setIsEditing(true)}
        onDelete={handleDelete}
      />

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit LOB Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
            </div>

            <div className="space-y-4">
              {contacts.map((contact) => (
                <ContactDisplay
                  key={contact.email}
                  contact={contact}
                  onDelete={handleDeleteContact}
                  onEdit={handleEditContact}
                />
              ))}

              <div className="border-t pt-4">
                <ContactForm
                  contact={newContact}
                  onChange={setNewContact}
                  onSubmit={editingContact ? handleUpdateContact : handleAddContact}
                  isEditing={!!editingContact}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setEditedName(lob.name);
                  setEditedDescription(category.detailedDescription || '');
                  setContacts(category.contacts);
                  setIsEditing(false);
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleSave}>Save Changes</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}