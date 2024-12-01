import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Objective } from "@/lib/types/objective";

interface InitiativesListProps {
  objectives: Objective[];
}

export function InitiativesList({ objectives }: InitiativesListProps) {
  const initiatives = [
    {
      id: '1',
      name: 'Customer Experience Enhancement',
      desiredOutcome: 'Achieve 95% customer satisfaction rating',
      alignedObjectives: ['1'], // Aligns with "Improve Customer Experience"
    },
    {
      id: '2',
      name: 'Legacy System Modernization',
      desiredOutcome: 'Complete migration of core systems to cloud infrastructure',
      alignedObjectives: ['2'], // Aligns with "Digital Transformation"
    },
    {
      id: '3',
      name: 'Process Automation',
      desiredOutcome: 'Automate 60% of manual processes',
      alignedObjectives: ['2', '3'], // Aligns with both Digital and Operational
    },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Strategic Initiatives</h3>
      <div className="grid grid-cols-1 gap-2">
        {initiatives.map((initiative) => (
          <Card key={initiative.id} className="hover:bg-accent/50 transition-colors">
            <CardContent className="p-4">
              <div className="flex flex-col space-y-2">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium">{initiative.name}</h4>
                  <div className="flex gap-1">
                    {initiative.alignedObjectives.map((objId) => {
                      const objective = objectives.find(o => o.id === objId);
                      return objective ? (
                        <Badge
                          key={objId}
                          variant="secondary"
                          className="text-xs"
                        >
                          {objective.title}
                        </Badge>
                      ) : null;
                    })}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  {initiative.desiredOutcome}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}