import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import { Edit2, Info, Plus, Trash2 } from "lucide-react";
import { DEPARTMENTS } from "@/lib/constants";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { toast } from "../ui/use-toast";
import { Contact } from "./data/businessCategories";

interface LOBCardProps {
  lob: { name: string; department: string; };
  category: { 
    name: string; 
    detailedDescription?: string;
    contacts: Contact[];
  };
  onUpdate: (updatedLob: { name: string; department: string; }) => void;
}

export function LOBCard({ lob, category, onUpdate }: LOBCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(lob.name);
  const [editedDescription, setEditedDescription] = useState(category.detailedDescription || '');
  const [contacts, setContacts] = useState<Contact[]>(category.contacts);
  const [newContact, setNewContact] = useState<Contact>({
    name: '',
    role: '',
    email: '',
    phone: ''
  });
  
  const deptColor = DEPARTMENTS.find(d => d.id === lob.department)?.color;

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
      phone: ''
    });
  };

  const handleDeleteContact = (email: string) => {
    setContacts(contacts.filter(contact => contact.email !== email));
  };

  return (
    <div className="group relative">
      <HoverCard>
        <HoverCardTrigger>
          <div
            className="p-3 rounded-lg transition-all hover:scale-105 cursor-pointer"
            style={{
              backgroundColor: `${deptColor}15`,
              borderLeft: `3px solid ${deptColor}`
            }}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm">{lob.name}</span>
              <Info className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </HoverCardTrigger>
        <HoverCardContent className="w-96">
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-medium">{lob.name}</h4>
                <p className="text-sm text-muted-foreground mt-2">{category.detailedDescription}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => setIsEditing(true)}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            </div>
            <div>
              <h5 className="font-medium mb-2">Contacts</h5>
              {contacts.map((contact, index) => (
                <div key={contact.email} className="space-y-1">
                  <p className="font-medium text-sm">{contact.name}</p>
                  <p className="text-sm text-muted-foreground">{contact.role}</p>
                  <div className="text-sm">
                    <a href={`mailto:${contact.email}`} className="text-blue-500 hover:underline">
                      {contact.email}
                    </a>
                  </div>
                  <p className="text-sm text-muted-foreground">{contact.phone}</p>
                  {index < contacts.length - 1 && <hr className="my-2" />}
                </div>
              ))}
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>

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
              <div className="flex items-center justify-between">
                <Label>Points of Contact</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddContact}
                  className="flex items-center gap-1"
                >
                  <Plus className="h-4 w-4" /> Add Contact
                </Button>
              </div>

              <div className="space-y-4">
                {contacts.map((contact, index) => (
                  <div key={contact.email} className="p-4 border rounded-lg space-y-2">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <p className="font-medium">{contact.name}</p>
                        <p className="text-sm text-muted-foreground">{contact.role}</p>
                        <p className="text-sm">{contact.email}</p>
                        {contact.phone && <p className="text-sm text-muted-foreground">{contact.phone}</p>}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteContact(contact.email)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}

                <div className="border-t pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="newContactName">Name</Label>
                      <Input
                        id="newContactName"
                        value={newContact.name}
                        onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="newContactRole">Role</Label>
                      <Input
                        id="newContactRole"
                        value={newContact.role}
                        onChange={(e) => setNewContact({ ...newContact, role: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="newContactEmail">Email</Label>
                      <Input
                        id="newContactEmail"
                        type="email"
                        value={newContact.email}
                        onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="newContactPhone">Phone</Label>
                      <Input
                        id="newContactPhone"
                        value={newContact.phone}
                        onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
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
    </div>
  );
}