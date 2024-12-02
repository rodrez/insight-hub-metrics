import { useState } from "react";
import { Collaborator, CollaborationType } from "@/lib/types/collaboration";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DEPARTMENTS } from "@/lib/constants";

interface CollaborationDialogProps {
  onClose: () => void;
  onSave: (collaborator: Collaborator) => void;
  collaboratorId?: string;
  collaborationType?: CollaborationType;
  departmentId?: string;
}

export function CollaborationDialog({ 
  onClose, 
  onSave, 
  collaboratorId,
  collaborationType = 'fortune30',
  departmentId 
}: CollaborationDialogProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [department, setDepartment] = useState<string | null>(departmentId || null);
  const [type, setType] = useState<CollaborationType>(collaborationType);
  const [ratMember, setRatMember] = useState("");

  const handleSave = () => {
    if (!name || !email || !role || !department || !type || !ratMember) {
      return;
    }

    const newCollaborator: Collaborator = {
      id: collaboratorId || `${Date.now()}`,
      name,
      email,
      role,
      department,
      projects: [],
      lastActive: new Date().toISOString(),
      type,
      ratMember
    };

    onSave(newCollaborator);
    onClose();
  };

  return (
    <div className="flex flex-col p-4">
      <h2 className="text-lg font-semibold mb-4">Add Collaborator</h2>
      <Input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="mb-2"
      />
      <Input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mb-2"
      />
      <Input
        placeholder="Role"
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="mb-2"
      />
      <Select value={department || ""} onValueChange={(value) => setDepartment(value)}>
        <SelectTrigger className="mb-2">
          <SelectValue placeholder="Select department" />
        </SelectTrigger>
        <SelectContent>
          {DEPARTMENTS.map(dept => (
            <SelectItem key={dept.id} value={dept.id}>
              {dept.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={type} onValueChange={(value) => setType(value as CollaborationType)}>
        <SelectTrigger className="mb-2">
          <SelectValue placeholder="Select collaboration type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="fortune30">Fortune 30</SelectItem>
          <SelectItem value="sme">SME</SelectItem>
          <SelectItem value="internal">Internal</SelectItem>
        </SelectContent>
      </Select>
      <Input
        placeholder="RAT Member"
        value={ratMember}
        onChange={(e) => setRatMember(e.target.value)}
        className="mb-2"
      />
      <div className="flex justify-end mt-4">
        <Button onClick={onClose} className="mr-2">Cancel</Button>
        <Button onClick={handleSave}>Save</Button>
      </div>
    </div>
  );
}