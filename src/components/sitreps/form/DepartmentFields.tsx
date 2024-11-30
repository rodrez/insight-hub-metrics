import { Label } from "@/components/ui/label";
import { DEPARTMENTS } from "@/lib/constants";
import { SupportingTeamsSelect } from "../SupportingTeamsSelect";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DepartmentFieldsProps {
  selectedDepartment: string;
  setSelectedDepartment: (department: string) => void;
  supportingTeams: string[];
  setSupportingTeams: (teams: string[]) => void;
  onTeamSelect?: (teamId: string) => void;
}

export function DepartmentFields({
  selectedDepartment,
  setSelectedDepartment,
  supportingTeams,
  setSupportingTeams,
  onTeamSelect
}: DepartmentFieldsProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label>Key Department</Label>
        <Select 
          value={selectedDepartment} 
          onValueChange={(value) => {
            setSelectedDepartment(value);
            if (onTeamSelect) {
              onTeamSelect(value);
            }
          }}
        >
          <SelectTrigger>
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

      <SupportingTeamsSelect
        supportingTeams={supportingTeams}
        setSupportingTeams={(teams) => {
          setSupportingTeams(teams);
          if (onTeamSelect) {
            const newTeams = teams.filter(t => !supportingTeams.includes(t));
            newTeams.forEach(teamId => onTeamSelect(teamId));
          }
        }}
      />
    </div>
  );
}