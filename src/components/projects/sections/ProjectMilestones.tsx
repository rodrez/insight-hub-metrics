import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Milestone } from "@/lib/types";
import { Calendar } from "lucide-react";
import { format } from "date-fns";

interface ProjectMilestonesProps {
  milestones: Milestone[];
}

export function ProjectMilestones({ milestones }: ProjectMilestonesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Milestones</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {milestones.map((milestone) => (
            <div key={milestone.id} className="border-b pb-4 last:border-0">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">{milestone.title}</h3>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {format(new Date(milestone.dueDate), 'MMM d, yyyy')}
                  </span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                {milestone.description}
              </p>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Badge variant={
                    milestone.status === 'completed' ? 'default' :
                    milestone.status === 'in-progress' ? 'secondary' : 'outline'
                  }>
                    {milestone.status}
                  </Badge>
                  <span className="text-sm font-medium">{milestone.progress}%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${milestone.progress}%` }}
                  />
                </div>
              </div>
              <div className="mt-4 flex justify-end space-x-2">
                <Button variant="outline" size="sm">Edit</Button>
                <Button variant="default" size="sm">Update Progress</Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}