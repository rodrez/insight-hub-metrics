import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Workstream } from "@/lib/types/collaboration";

type CollaboratorWorkstreamsProps = {
  workstreams?: Workstream[];
};

export function CollaboratorWorkstreams({ workstreams }: CollaboratorWorkstreamsProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString();
  };

  if (!workstreams?.length) {
    return (
      <div>
        <h4 className="font-medium mb-4">Workstreams</h4>
        <p className="text-sm text-muted-foreground">No workstreams defined</p>
      </div>
    );
  }

  return (
    <div>
      <h4 className="font-medium mb-4">Workstreams</h4>
      <div className="space-y-4">
        {workstreams.map((workstream) => (
          <Card key={workstream.id}>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start mb-2">
                <h5 className="font-medium">{workstream.title}</h5>
                <Badge variant={
                  workstream.status === 'active' ? 'default' :
                  workstream.status === 'completed' ? 'secondary' :
                  'outline'
                }>
                  {workstream.status}
                </Badge>
              </div>
              <div className="space-y-2 text-sm">
                <div>
                  <p className="font-medium">Objectives:</p>
                  <p className="text-muted-foreground">{workstream.objectives}</p>
                </div>
                <Separator />
                <div>
                  <p className="font-medium">Next Steps:</p>
                  <p className="text-muted-foreground">{workstream.nextSteps}</p>
                </div>
                <div className="text-xs text-muted-foreground">
                  Last updated: {formatDate(workstream.lastUpdated)}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}