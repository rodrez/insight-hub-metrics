import { TooltipContent } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { Collaborator } from "@/lib/types";
import { Separator } from "@/components/ui/separator";

interface SMEDetailsProps {
  partner: Collaborator;
}

export function SMEDetails({ partner }: SMEDetailsProps) {
  return (
    <TooltipContent className="w-80 p-4">
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <h4 className="font-medium">{partner.name}</h4>
            <p className="text-sm text-muted-foreground">{partner.role}</p>
          </div>
          <Info className="h-4 w-4 text-muted-foreground" />
        </div>

        {partner.primaryContact && (
          <>
            <Separator />
            <div>
              <p className="text-sm font-medium mb-1">Primary Contact</p>
              <p className="text-sm">{partner.primaryContact.name}</p>
              <p className="text-sm text-muted-foreground">{partner.primaryContact.email}</p>
            </div>
          </>
        )}

        {partner.projects && partner.projects.length > 0 && (
          <>
            <Separator />
            <div>
              <p className="text-sm font-medium mb-1">Active Projects</p>
              <div className="space-y-1">
                {partner.projects.map((project, index) => (
                  <p key={index} className="text-sm text-muted-foreground">
                    {project.name}
                  </p>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </TooltipContent>
  );
}