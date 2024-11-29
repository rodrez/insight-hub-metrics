import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Circle, CheckCircle, Check } from "lucide-react";
import { format } from "date-fns";
import { SitRep } from "@/lib/types/sitrep";

interface SitRepCardProps {
  sitrep: SitRep;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function SitRepCard({ sitrep, onEdit, onDelete }: SitRepCardProps) {
  const getStatusIcon = () => {
    switch (sitrep.status) {
      case 'pending-review':
        return <Circle className="h-5 w-5 text-red-500" />;
      case 'ready':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'submitted':
        return <Check className="h-5 w-5 text-blue-500" />;
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
              {getStatusIcon()}
            </div>
          </div>

          <p className="text-gray-300">{sitrep.summary}</p>

          <div className="flex items-center gap-4 text-sm text-gray-400">
            <span>{format(new Date(sitrep.date), "MM/dd/yyyy")}</span>
            <span>{wordCount} words</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}