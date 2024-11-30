import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Project } from "@/lib/types";
import { Collaborator } from "@/lib/types/collaboration";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { POCFields } from "./POCFields";
import { Contact } from "@/lib/types/pointOfContact";

export interface RelationshipFieldsProps {
  selectedProject: string;
  setSelectedProject: (id: string) => void;
  selectedFortune30: string;
  setSelectedFortune30: (id: string) => void;
  selectedSME: string;
  setSelectedSME: (id: string) => void;
  projects: Project[];
  fortune30Partners: Collaborator[];
  contacts: Contact[];
  onContactsChange: (contacts: Contact[]) => void;
}

export function RelationshipFields({
  selectedProject,
  setSelectedProject,
  selectedFortune30,
  setSelectedFortune30,
  selectedSME,
  setSelectedSME,
  projects = [],
  fortune30Partners = [],
  contacts,
  onContactsChange
}: RelationshipFieldsProps) {
  return (
    <div className="space-y-4">
      <POCFields
        contacts={contacts}
        onContactsChange={onContactsChange}
      />

      <div className="pt-6 border-t">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-lg font-semibold">Additional Relationships</h3>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon">
              <Info className="h-4 w-4" />
            </Button>
          </DialogTrigger>
        </div>

        <div className="space-y-4">
          <div>
            <Label>Project (Optional)</Label>
            <Select value={selectedProject} onValueChange={setSelectedProject}>
              <SelectTrigger>
                <SelectValue placeholder="Select a project" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {projects?.map(project => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Fortune 30 Partner (Optional)</Label>
            <Select value={selectedFortune30} onValueChange={setSelectedFortune30}>
              <SelectTrigger>
                <SelectValue placeholder="Select a Fortune 30 partner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {fortune30Partners?.map(partner => (
                  <SelectItem key={partner.id} value={partner.id}>
                    {partner.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>SME Partner (Optional)</Label>
            <Select value={selectedSME} onValueChange={setSelectedSME}>
              <SelectTrigger>
                <SelectValue placeholder="Select an SME partner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Dialog>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Relationship Information</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Projects, Fortune 30 Partners, and SME Partners help establish connections between different entities in the system.</p>
            <p>Select these relationships to better track collaborations and dependencies.</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}