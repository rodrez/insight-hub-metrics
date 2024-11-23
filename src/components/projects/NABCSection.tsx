import { NABC } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";

interface NABCSectionProps {
  projectId: string;
  nabc: NABC;
  onUpdate: (newNabc: NABC) => void;
  isEditing: boolean;
}

export function NABCSection({ projectId, nabc, onUpdate, isEditing }: NABCSectionProps) {
  if (!isEditing) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TooltipProvider>
          <Card>
            <CardHeader>
              <CardTitle>
                <Tooltip>
                  <TooltipTrigger className="flex items-center gap-2">
                    Needs
                    <Info className="h-4 w-4" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>What customer and market needs are being addressed?</p>
                  </TooltipContent>
                </Tooltip>
              </CardTitle>
            </CardHeader>
            <CardContent>{nabc.needs}</CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>
                <Tooltip>
                  <TooltipTrigger className="flex items-center gap-2">
                    Approach
                    <Info className="h-4 w-4" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>How will these needs be met?</p>
                  </TooltipContent>
                </Tooltip>
              </CardTitle>
            </CardHeader>
            <CardContent>{nabc.approach}</CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>
                <Tooltip>
                  <TooltipTrigger className="flex items-center gap-2">
                    Benefits
                    <Info className="h-4 w-4" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>What are the quantifiable benefits?</p>
                  </TooltipContent>
                </Tooltip>
              </CardTitle>
            </CardHeader>
            <CardContent>{nabc.benefits}</CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>
                <Tooltip>
                  <TooltipTrigger className="flex items-center gap-2">
                    Competition
                    <Info className="h-4 w-4" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>How does this compare to competitive approaches?</p>
                  </TooltipContent>
                </Tooltip>
              </CardTitle>
            </CardHeader>
            <CardContent>{nabc.competition}</CardContent>
          </Card>
        </TooltipProvider>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="font-medium">Needs</label>
          <Textarea
            value={nabc.needs}
            onChange={(e) => onUpdate({ ...nabc, needs: e.target.value })}
            placeholder="What customer and market needs are being addressed?"
          />
        </div>
        <div className="space-y-2">
          <label className="font-medium">Approach</label>
          <Textarea
            value={nabc.approach}
            onChange={(e) => onUpdate({ ...nabc, approach: e.target.value })}
            placeholder="How will these needs be met?"
          />
        </div>
        <div className="space-y-2">
          <label className="font-medium">Benefits</label>
          <Textarea
            value={nabc.benefits}
            onChange={(e) => onUpdate({ ...nabc, benefits: e.target.value })}
            placeholder="What are the quantifiable benefits?"
          />
        </div>
        <div className="space-y-2">
          <label className="font-medium">Competition</label>
          <Textarea
            value={nabc.competition}
            onChange={(e) => onUpdate({ ...nabc, competition: e.target.value })}
            placeholder="How does this compare to competitive approaches?"
          />
        </div>
      </div>
    </div>
  );
}
