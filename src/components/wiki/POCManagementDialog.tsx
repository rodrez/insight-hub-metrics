import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { ContactPerson } from "@/lib/types/collaboration";
import { Trash2 } from "lucide-react";

interface POCManagementDialogProps {
  categoryName: string;
  contacts: ContactPerson[];
  onSave: (contacts: ContactPerson[]) => void;
}

export function POCManagementDialog({ categoryName, contacts, onSave }: POCManagementDialogProps) {
  const [editableContacts, setEditableContacts] = useState<ContactPerson[]>(contacts);
  const [open, setOpen] = useState(false);

  const handleAddContact = () => {
    setEditableContacts([...editableContacts, {
      name: "",
      role: "",
      email: "",
      phone: ""
    }]);
  };

  const handleDeleteContact = (index: number) => {
    setEditableContacts(editableContacts.filter((_, i) => i !== index));
  };

  const handleUpdateContact = (index: number, field: keyof ContactPerson, value: string) => {
    const updatedContacts = editableContacts.map((contact, i) => {
      if (i === index) {
        return { ...contact, [field]: value };
      }
      return contact;
    });
    setEditableContacts(updatedContacts);
  };

  const handleSave = () => {
    onSave(editableContacts);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">Manage POCs</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Manage {categoryName} POCs</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 max-h-[60vh] overflow-y-auto">
          {editableContacts.map((contact, index) => (
            <div key={index} className="space-y-4 p-4 border rounded-lg relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2"
                onClick={() => handleDeleteContact(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Name</label>
                  <Input
                    value={contact.name}
                    onChange={(e) => handleUpdateContact(index, "name", e.target.value)}
                    placeholder="Enter name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Role</label>
                  <Input
                    value={contact.role}
                    onChange={(e) => handleUpdateContact(index, "role", e.target.value)}
                    placeholder="Enter role"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    value={contact.email}
                    onChange={(e) => handleUpdateContact(index, "email", e.target.value)}
                    placeholder="Enter email"
                    type="email"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone</label>
                  <Input
                    value={contact.phone || ""}
                    onChange={(e) => handleUpdateContact(index, "phone", e.target.value)}
                    placeholder="Enter phone"
                  />
                </div>
              </div>
            </div>
          ))}
          <Button onClick={handleAddContact} className="w-full">
            Add POC
          </Button>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}