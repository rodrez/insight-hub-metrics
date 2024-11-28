import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Objective } from "@/lib/types/objective";
import { SPI } from "@/lib/types/spi";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Checkbox } from "@/components/ui/checkbox";

interface ObjectiveCardProps {
  objective: Objective;
  spis: SPI[];
  onSPIsChange: (objectiveId: string, spiIds: string[]) => void;
}

export function ObjectiveCard({ objective, spis, onSPIsChange }: ObjectiveCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSPIToggle = (spiId: string) => {
    const newSPIIds = objective.spiIds.includes(spiId)
      ? objective.spiIds.filter(id => id !== spiId)
      : [...objective.spiIds, spiId];
    onSPIsChange(objective.id, newSPIIds);
  };

  return (
    <Card>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{objective.initiative}</CardTitle>
              <p className="text-sm text-muted-foreground mt-2">{objective.desiredOutcome}</p>
            </div>
            <CollapsibleTrigger>
              {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </CollapsibleTrigger>
          </div>
        </CardHeader>
        <CollapsibleContent>
          <CardContent>
            <div className="space-y-2">
              {spis.map((spi) => (
                <div key={spi.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`spi-${spi.id}`}
                    checked={objective.spiIds.includes(spi.id)}
                    onCheckedChange={() => handleSPIToggle(spi.id)}
                  />
                  <label htmlFor={`spi-${spi.id}`} className="text-sm">
                    {spi.name}
                  </label>
                </div>
              ))}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}