import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { SitRep } from "@/lib/types/sitrep";

interface SitRepCardProps {
  sitrep: SitRep;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function SitRepCard({ sitrep, onEdit, onDelete }: SitRepCardProps) {
  const wordCount = sitrep.summary.split(/\s+/).length;

  return (
    <Card className="bg-[#1A1F2C] text-white mb-4">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-semibold">{sitrep.title}</h3>
              <Badge variant="outline" className="ml-2">
                CEO Level
              </Badge>
              <Check className="h-5 w-5 text-green-500" />
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit?.(sitrep.id)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete?.(sitrep.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <p className="text-gray-300">{sitrep.summary}</p>

          <div className="flex items-center gap-4 text-sm text-gray-400">
            <span>{format(new Date(sitrep.date), "MM/dd/yyyy")}</span>
            <span>CEO</span>
            <span>{wordCount} words</span>
          </div>

          {(sitrep.departmentId || sitrep.projectId) && (
            <div className="space-y-2">
              <div>
                <h4 className="text-sm font-medium mb-2">Points of Contact:</h4>
                <div className="flex gap-2">
                  <Badge variant="secondary" className="bg-green-700">Sarah Chen</Badge>
                  <Badge variant="secondary" className="bg-blue-600">Lisa Park</Badge>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">Teams:</h4>
                <div className="flex gap-2">
                  <Badge variant="secondary" className="bg-green-700">Engineering</Badge>
                  <Badge variant="secondary" className="bg-blue-600">Operations</Badge>
                  <Badge variant="secondary" className="bg-orange-600">Security</Badge>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}