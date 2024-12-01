import { CheckCircle, Clock, AlertCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function StatusIcon({ status }: { status: string }) {
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'submitted':
        return {
          icon: <CheckCircle className="h-5 w-5 text-green-500" />,
          description: "This SitRep has been submitted and is complete"
        };
      case 'pending-review':
        return {
          icon: <Clock className="h-5 w-5 text-yellow-500" />,
          description: "This SitRep is awaiting review from the appropriate stakeholders"
        };
      case 'ready':
        return {
          icon: <AlertCircle className="h-5 w-5 text-blue-500" />,
          description: "This SitRep is ready for final review and submission"
        };
      default:
        return {
          icon: null,
          description: ""
        };
    }
  };

  const statusInfo = getStatusInfo(status);
  
  if (!statusInfo.icon) return null;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div>{statusInfo.icon}</div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{statusInfo.description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}