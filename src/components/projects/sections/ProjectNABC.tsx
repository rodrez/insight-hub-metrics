import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NABC } from "@/lib/types";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ProjectNABCProps {
  nabc: NABC;
}

export function ProjectNABC({ nabc }: ProjectNABCProps) {
  const sections = [
    { title: "Needs", content: nabc.needs, tooltip: "What customer and market needs are being addressed?" },
    { title: "Approach", content: nabc.approach, tooltip: "How will these needs be met?" },
    { title: "Benefits", content: nabc.benefits, tooltip: "What are the quantifiable benefits?" },
    { title: "Competition", content: nabc.competition, tooltip: "How does this compare to competitive approaches?" }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {sections.map((section) => (
        <Card key={section.title}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <span className="font-semibold underline">{section.title}</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{section.tooltip}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{section.content}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}