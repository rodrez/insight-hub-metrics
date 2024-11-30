import { Badge } from "@/components/ui/badge";
import { DEPARTMENTS } from "@/lib/constants";

interface TeamBadgesProps {
  teams: string[];
  keyTeam?: string;
  poc?: string;
  pocDepartment?: string;
}

export function TeamBadges({ teams, keyTeam, poc, pocDepartment }: TeamBadgesProps) {
  const getDepartmentColor = (departmentId: string) => {
    const department = DEPARTMENTS.find(d => d.id === departmentId);
    return department?.color || '#333';
  };

  const sortedTeams = teams?.filter(team => team !== keyTeam) || [];

  return (
    <div className="space-y-3">
      {poc && pocDepartment && (
        <div>
          <p className="text-sm text-gray-400 mb-2">Point of Contact:</p>
          <Badge
            style={{ 
              backgroundColor: getDepartmentColor(pocDepartment),
              color: 'white' 
            }}
          >
            {poc}
          </Badge>
        </div>
      )}
      
      <div>
        <p className="text-sm text-gray-400 mb-2">Teams:</p>
        <div className="flex flex-wrap gap-2">
          {keyTeam && (
            <Badge
              key={keyTeam}
              style={{ 
                backgroundColor: getDepartmentColor(keyTeam),
                color: 'white'
              }}
              className="font-medium"
            >
              {DEPARTMENTS.find(d => d.id === keyTeam)?.name || keyTeam}
            </Badge>
          )}
          
          {sortedTeams.map((team) => (
            <Badge
              key={team}
              style={{ 
                backgroundColor: getDepartmentColor(team),
                opacity: 0.8,
                color: 'white'
              }}
            >
              {DEPARTMENTS.find(d => d.id === team)?.name || team}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}