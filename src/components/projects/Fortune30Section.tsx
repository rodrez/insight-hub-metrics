import { Project } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Fortune30SectionProps = {
  project: Project;
};

export function Fortune30Section({ project }: Fortune30SectionProps) {
  const navigate = useNavigate();

  const fortune30Partners = project.collaborators.filter(
    (collab) => collab.type === "fortune30"
  );

  if (fortune30Partners.length === 0) {
    return null;
  }

  const handlePartnerClick = (partnerId: string) => {
    navigate('/collaborations', { state: { scrollToPartner: partnerId } });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Fortune 30 Partners</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-3">
          {fortune30Partners.map((partner) => (
            <TooltipProvider key={partner.id}>
              <Tooltip>
                <TooltipTrigger>
                  <Badge
                    variant="default"
                    style={{ backgroundColor: partner.color }}
                    className="text-white cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => handlePartnerClick(partner.id)}
                  >
                    {partner.name}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Role: {partner.role}</p>
                  <p>Last Active: {new Date(partner.lastActive).toLocaleDateString()}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}