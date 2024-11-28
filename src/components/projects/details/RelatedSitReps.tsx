import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";
import { format } from "date-fns";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface RelatedSitRepsProps {
  sitreps: any[];
  projectId: string;
}

export function RelatedSitReps({ sitreps, projectId }: RelatedSitRepsProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'delayed':
        return 'bg-red-500';
      case 'at-risk':
        return 'bg-yellow-500';
      case 'cancelled':
        return 'bg-gray-500';
      default:
        return 'bg-blue-500';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Related SitReps
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <TooltipProvider>
          {sitreps?.filter(sitrep => sitrep.projectId === projectId)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .map(sitrep => (
              <div key={sitrep.id} className="flex items-center justify-between p-2 border rounded">
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(sitrep.status)}>{sitrep.status}</Badge>
                  <Tooltip>
                    <TooltipTrigger className="text-left">
                      <span>{sitrep.title}</span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Created on {format(new Date(sitrep.date), 'PPP')}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <p className="text-sm text-muted-foreground">{sitrep.summary}</p>
              </div>
            ))}
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}