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

export interface RelationshipFieldsProps {
  selectedProject: string;
  setSelectedProject: (id: string) => void;
  selectedFortune30: string;
  setSelectedFortune30: (id: string) => void;
  selectedSME: string;
  setSelectedSME: (id: string) => void;
  projects: Project[];
  fortune30Partners: Collaborator[];
}

export function RelationshipFields({
  selectedProject,
  setSelectedProject,
  selectedFortune30,
  setSelectedFortune30,
  selectedSME,
  setSelectedSME,
  projects = [],
  fortune30Partners = []
}: RelationshipFieldsProps) {
  return (
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
  );
}