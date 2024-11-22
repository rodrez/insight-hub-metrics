import { Project } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowDown, ArrowRight, ArrowUp, Calendar } from "lucide-react";
import { format } from "date-fns";

interface ProjectDetailsProps {
  project: Project;
}

const mockProject = {
  id: '1',
  name: 'Sample Project',
  departmentId: 'airplanes',
  poc: 'John Doe',
  budget: 500000,
  status: 'active' as const,
  nabc: {
    needs: 'Market need for efficient air transport',
    approach: 'Innovative design and manufacturing',
    benefits: 'Reduced fuel consumption, lower costs',
    competition: 'Traditional manufacturers'
  },
  milestones: [
    {
      id: '1',
      title: 'Design Phase',
      description: 'Complete initial design',
      dueDate: '2024-06-30',
      status: 'in-progress' as const
    }
  ],
  metrics: [
    {
      id: '1',
      name: 'Development Progress',
      value: 45,
      target: 100,
      unit: '%',
      trend: 'up' as const
    }
  ]
};

export default function ProjectDetails() {
  return <ProjectDetailsComponent project={mockProject} />;
}

function ProjectDetailsComponent({ project }: ProjectDetailsProps) {
  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <ArrowUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <ArrowDown className="h-4 w-4 text-red-500" />;
      default:
        return <ArrowRight className="h-4 w-4 text-yellow-500" />;
    }
  };

  return (
    <div className="container mx-auto px-4 space-y-6 py-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{project.name}</h1>
        <Badge variant={
          project.status === 'active' ? 'default' :
          project.status === 'completed' ? 'secondary' : 'destructive'
        }>
          {project.status}
        </Badge>
      </div>

      {project.nabc && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Needs</CardTitle>
            </CardHeader>
            <CardContent>{project.nabc.needs}</CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Approach</CardTitle>
            </CardHeader>
            <CardContent>{project.nabc.approach}</CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Benefits</CardTitle>
            </CardHeader>
            <CardContent>{project.nabc.benefits}</CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Competition</CardTitle>
            </CardHeader>
            <CardContent>{project.nabc.competition}</CardContent>
          </Card>
        </div>
      )}

      {project.milestones && (
        <Card>
          <CardHeader>
            <CardTitle>Milestones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {project.milestones.map((milestone) => (
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
                  <p className="text-sm text-muted-foreground mb-2">
                    {milestone.description}
                  </p>
                  <Badge variant={
                    milestone.status === 'completed' ? 'default' :
                    milestone.status === 'in-progress' ? 'secondary' : 'outline'
                  }>
                    {milestone.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {project.metrics && (
        <Card>
          <CardHeader>
            <CardTitle>Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {project.metrics.map((metric) => (
                <div key={metric.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{metric.name}</span>
                    {getTrendIcon(metric.trend)}
                  </div>
                  <div className="text-2xl font-bold mb-2">
                    {metric.value} {metric.unit}
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">
                      Target: {metric.target} {metric.unit}
                    </div>
                    <Progress 
                      value={(metric.value / metric.target) * 100} 
                      className="h-2"
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
