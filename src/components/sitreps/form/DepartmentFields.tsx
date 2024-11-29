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
}

export function DepartmentFields({
  selectedDepartment,
  setSelectedDepartment,
  supportingTeams,
  setSupportingTeams,
}: DepartmentFieldsProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label>Key Department</Label>
        <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
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
        setSupportingTeams={setSupportingTeams}
      />
    </div>
  );
}