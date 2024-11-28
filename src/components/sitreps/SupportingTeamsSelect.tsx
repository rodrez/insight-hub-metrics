import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { DEPARTMENTS } from "@/lib/constants";

interface SupportingTeamsSelectProps {
  supportingTeams: string[];
  setSupportingTeams: (teams: string[]) => void;
}

export function SupportingTeamsSelect({ supportingTeams, setSupportingTeams }: SupportingTeamsSelectProps) {
  return (
    <div>
      <Label className="text-white">Supporting Teams</Label>
      <ScrollArea className="h-32 rounded-md border border-gray-700 bg-[#13151D]">
        <div className="p-4 space-y-2">
          {DEPARTMENTS.map((dept) => (
            <div key={dept.id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={dept.id}
                checked={supportingTeams.includes(dept.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSupportingTeams([...supportingTeams, dept.id]);
                  } else {
                    setSupportingTeams(supportingTeams.filter(t => t !== dept.id));
                  }
                }}
                className="rounded border-gray-700"
              />
              <Label htmlFor={dept.id}>{dept.name}</Label>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}