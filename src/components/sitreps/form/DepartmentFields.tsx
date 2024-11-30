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
import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/db";

interface DepartmentFieldsProps {
  selectedDepartment: string;
  setSelectedDepartment: (department: string) => void;
  supportingTeams: string[];
  setSupportingTeams: (teams: string[]) => void;
  onTeamSelect?: (teamId: string) => void;
  poc?: string;
  setPoc?: (poc: string) => void;
  pocDepartment?: string;
  setPocDepartment?: (department: string) => void;
}

export function DepartmentFields({
  selectedDepartment,
  setSelectedDepartment,
  supportingTeams,
  setSupportingTeams,
  onTeamSelect,
  poc,
  setPoc,
  pocDepartment,
  setPocDepartment
}: DepartmentFieldsProps) {
  const { data: internalPartners = [] } = useQuery({
    queryKey: ['collaborators-internal'],
    queryFn: async () => {
      const allCollaborators = await db.getAllCollaborators();
      return allCollaborators.filter(c => c.type === 'internal');
    },
  });

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

      {setPoc && setPocDepartment && (
        <div>
          <Label>Point of Contact</Label>
          <Select
            value={poc}
            onValueChange={(value) => {
              const partner = internalPartners.find(p => p.name === value);
              if (partner) {
                setPoc(partner.name);
                setPocDepartment(partner.department);
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select POC" />
            </SelectTrigger>
            <SelectContent>
              {internalPartners.map((partner) => (
                <SelectItem key={partner.id} value={partner.name}>
                  {partner.name} ({DEPARTMENTS.find(d => d.id === partner.department)?.name})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

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