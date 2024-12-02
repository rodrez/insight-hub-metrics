import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pen, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { SitRep } from "@/lib/types/sitrep";
import { StatusIcon } from "./card/StatusIcon";
import { LevelBadge } from "./card/LevelBadge";
import { TeamBadges } from "./card/TeamBadges";
import { POCDisplay } from "./card/POCDisplay";

interface SitRepCardProps {
  sitrep: SitRep;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function SitRepCard({ sitrep, onEdit, onDelete }: SitRepCardProps) {
  return (
    <Card id={`sitrep-${sitrep.id}`} className="relative overflow-hidden group">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <StatusIcon status={sitrep.status} />
              <h3 className="text-lg font-semibold">{sitrep.title}</h3>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-sm text-muted-foreground">
                {format(new Date(sitrep.date), 'PPP')}
              </p>
              <LevelBadge level={sitrep.level} />
              <Badge variant="secondary" className="bg-purple-100 text-purple-800 border-purple-300">
                RAT Member: {sitrep.ratMember}
              </Badge>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(sitrep.id)}
              className="text-gray-400 hover:text-green-500 transition-colors"
            >
              <Pen className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(sitrep.id)}
              className="text-gray-400 hover:text-red-500 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Summary</h4>
              <p className="text-sm text-muted-foreground">{sitrep.summary}</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Update</h4>
              <p className="text-sm text-muted-foreground">{sitrep.update}</p>
            </div>
          </div>
          <div className="space-y-4">
            <TeamBadges
              teams={sitrep.teams || []}
              keyTeam={sitrep.departmentId}
              poc={sitrep.poc}
              pocDepartment={sitrep.pocDepartment}
            />
            <POCDisplay pointsOfContact={sitrep.pointsOfContact || []} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}