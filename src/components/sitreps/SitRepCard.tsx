import { format } from "date-fns";
import { Pen, Trash2, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SitRep } from "@/lib/types/sitrep";

interface SitRepCardProps {
  sitrep: SitRep;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function SitRepCard({ sitrep, onEdit, onDelete }: SitRepCardProps) {
  const getStatusIcon = () => {
    switch (sitrep.status) {
      case 'submitted':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return null;
    }
  };

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

  const wordCount = sitrep.summary.split(/\s+/).length;

  return (
    <Card className="bg-[#1A1F2C] text-white mb-4">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-semibold">{sitrep.title}</h3>
              {sitrep.level && (
                <Badge variant="outline" className="ml-2">
                  {sitrep.level} Level
                </Badge>
              )}
              {getStatusIcon()}
            </div>
            <div className="flex gap-2">
              {onEdit && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(sitrep.id)}
                  className="text-gray-400 hover:text-white"
                >
                  <Pen className="h-4 w-4" />
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(sitrep.id)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          <p className="text-gray-300">{sitrep.summary}</p>

          <div className="flex items-center gap-4 text-sm text-gray-400">
            <span>{format(new Date(sitrep.date), "MM/dd/yyyy")}</span>
            <span>{sitrep.level}</span>
            <span>{wordCount} words</span>
          </div>

          {(sitrep.pointsOfContact?.length > 0 || sitrep.teams?.length > 0) && (
            <div className="space-y-3 pt-2">
              {sitrep.pointsOfContact && sitrep.pointsOfContact.length > 0 && (
                <div>
                  <p className="text-sm text-gray-400 mb-2">Points of Contact:</p>
                  <div className="flex flex-wrap gap-2">
                    {sitrep.pointsOfContact.map((contact, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-emerald-600/20 text-emerald-400"
                      >
                        {contact}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {sitrep.teams && sitrep.teams.length > 0 && (
                <div>
                  <p className="text-sm text-gray-400 mb-2">Teams:</p>
                  <div className="flex flex-wrap gap-2">
                    {sitrep.teams.map((team, index) => (
                      <Badge
                        key={index}
                        className={getTeamBadgeColor(team)}
                      >
                        {team}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}