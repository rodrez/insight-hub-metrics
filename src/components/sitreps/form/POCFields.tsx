import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DEPARTMENTS } from "@/lib/constants";
import { Contact } from "@/lib/types/pointOfContact";
import { Pen, X } from "lucide-react";

interface POCFieldsProps {
  contacts: Contact[];
  onContactsChange: (contacts: Contact[]) => void;
}

export function POCFields({ contacts, onContactsChange }: POCFieldsProps) {
  const [newContact, setNewContact] = useState<Contact>({
    name: "",
    title: "",
    email: "",
    department: "",
  });

  const handleAddContact = () => {
    if (newContact.name && newContact.email && newContact.department) {
      onContactsChange([...contacts, newContact]);
      setNewContact({
        name: "",
        title: "",
        email: "",
        department: "",
      });
    }
  };

  const handleDeleteContact = (email: string) => {
    onContactsChange(contacts.filter(c => c.email !== email));
  };

  const getDepartmentColor = (deptId: string) => {
    const dept = DEPARTMENTS.find(d => d.id === deptId);
    return dept?.color || "#4B5563"; // default gray if not found
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Points of Contact</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Name</Label>
            <Input
              placeholder="Enter name"
              value={newContact.name}
              onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
              className="bg-[#13151D] border-gray-700"
            />
          </div>
          <div>
            <Label>Title</Label>
            <Input
              placeholder="Enter title"
              value={newContact.title}
              onChange={(e) => setNewContact({ ...newContact, title: e.target.value })}
              className="bg-[#13151D] border-gray-700"
            />
          </div>
          <div>
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="Enter email"
              value={newContact.email}
              onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
              className="bg-[#13151D] border-gray-700"
            />
          </div>
          <div>
            <Label>Department</Label>
            <Select
              value={newContact.department}
              onValueChange={(value) => setNewContact({ ...newContact, department: value })}
            >
              <SelectTrigger className="bg-[#13151D] border-gray-700">
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {DEPARTMENTS.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={handleAddContact}
          className="w-full bg-[#13151D] border-gray-700 mt-2"
        >
          + Add POC
        </Button>
      </div>

      <div className="space-y-3">
        {contacts.map((contact, index) => (
          <div
            key={`${contact.email}-${index}`}
            className="p-4 rounded-lg space-y-1"
            style={{
              backgroundColor: `${getDepartmentColor(contact.department)}15`,
              borderLeft: `3px solid ${getDepartmentColor(contact.department)}`
            }}
          >
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <h4 className="font-medium">{contact.name}</h4>
                <p className="text-sm text-muted-foreground">{contact.title}</p>
                <p className="text-sm">{contact.email}</p>
                <p className="text-sm">
                  Team: <span style={{ color: getDepartmentColor(contact.department) }}>
                    {DEPARTMENTS.find(d => d.id === contact.department)?.name}
                  </span>
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-gray-400 hover:text-green-500"
                >
                  <Pen className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteContact(contact.email)}
                  className="h-6 w-6 text-gray-400 hover:text-red-500"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}