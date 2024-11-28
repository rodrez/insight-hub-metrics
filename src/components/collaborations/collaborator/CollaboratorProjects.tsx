import { Info } from "lucide-react";
import { Project } from "@/lib/types";
import { CollaboratorAgreements } from "@/lib/types/collaboration";
import { CollaboratorProject } from "../CollaboratorProject";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type CollaboratorProjectsProps = {
  projects: Project[];
  agreements?: CollaboratorAgreements;
  warningSettings: {
    warningDays: number;
    criticalDays: number;
    warningColor: string;
    criticalColor: string;
  };
};

export function CollaboratorProjects({ projects, agreements, warningSettings }: CollaboratorProjectsProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString();
  };

  const getDaysUntilExpiry = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const today = new Date();
    const diffTime = expiry.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getExpiryWarningColor = (expiryDate: string) => {
    const daysUntil = getDaysUntilExpiry(expiryDate);
    if (daysUntil <= warningSettings.criticalDays) {
      return warningSettings.criticalColor;
    }
    if (daysUntil <= warningSettings.warningDays) {
      return warningSettings.warningColor;
    }
    return undefined;
  };

  return (
    <div>
      <h4 className="font-medium mb-2 flex items-center gap-2">
        Associated Projects
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Info className="h-4 w-4" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Yellow background: Agreement expires within {warningSettings.warningDays} days</p>
              <p>Red background: Agreement expires within {warningSettings.criticalDays} days</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </h4>
      <div className="space-y-2">
        {projects.map((project) => {
          const nda = agreements?.nda;
          const jtda = agreements?.jtda;
          const warningColor = nda ? getExpiryWarningColor(nda.expiryDate) : 
                             jtda ? getExpiryWarningColor(jtda.expiryDate) : 
                             undefined;
          
          return (
            <CollaboratorProject
              key={project.id}
              project={{
                id: project.id,
                name: project.name,
                nabc: project.nabc,
                status: project.status
              }}
              agreements={agreements}
              warningColor={warningColor}
              formatDate={formatDate}
            />
          );
        })}
      </div>
    </div>
  );
}