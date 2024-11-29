import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { scrollToProject } from "@/utils/scrollUtils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface RelatedSPIsProps {
  spis: any[];
  projectId: string;
}

export function RelatedSPIs({ spis, projectId }: RelatedSPIsProps) {
  const navigate = useNavigate();

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

  const handleSPIClick = (spiId: string) => {
    navigate('/spi');
    setTimeout(() => {
      const element = document.getElementById(`spi-${spiId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Related SPIs
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <TooltipProvider>
          {spis?.filter(spi => spi.projectId === projectId).map(spi => (
            <div 
              key={spi.id} 
              className="flex items-center justify-between p-2 border rounded cursor-pointer hover:bg-accent/50 transition-colors"
              onClick={() => handleSPIClick(spi.id)}
            >
              <div className="flex items-center gap-2">
                <Badge className={getStatusColor(spi.status)}>{spi.status}</Badge>
                <Tooltip>
                  <TooltipTrigger className="text-left">
                    <span>{spi.name}</span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      {spi.status === 'completed' 
                        ? `Completed on ${format(new Date(spi.actualCompletionDate!), 'PPP')}`
                        : `Due by ${format(new Date(spi.expectedCompletionDate), 'PPP')}`}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <p className="text-sm text-muted-foreground">{spi.deliverable}</p>
            </div>
          ))}
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}