import { Badge } from "@/components/ui/badge";

interface TeamBadgesProps {
  teams: string[];
}

export function TeamBadges({ teams }: TeamBadgesProps) {
  const getTeamBadgeColor = (team: string) => {
    switch (team.toLowerCase()) {
      case 'engineering':
        return 'bg-emerald-600 text-white';
      case 'operations':
        return 'bg-blue-500 text-white';
      case 'security':
        return 'bg-orange-500 text-white';
      case 'product':
        return 'bg-indigo-600 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <div>
      <p className="text-sm text-gray-400 mb-2">Teams:</p>
      <div className="flex flex-wrap gap-2">
        {teams.map((team, index) => (
          <Badge
            key={index}
            className={getTeamBadgeColor(team)}
          >
            {team}
          </Badge>
        ))}
      </div>
    </div>
  );
}