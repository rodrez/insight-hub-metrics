import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Target, CheckCircle2, Clock, Activity } from "lucide-react";

export function ObjectivesSummary() {
  const { data: objectives = [] } = useQuery({
    queryKey: ['objectives'],
    queryFn: () => db.getAllObjectives()
  });

  const stats = [
    {
      title: "Total Objectives",
      value: objectives.length,
      icon: Target,
      color: "text-blue-500"
    },
    {
      title: "Completed",
      value: objectives.filter(obj => obj.desiredOutcome.includes("100%")).length,
      icon: CheckCircle2,
      color: "text-green-500"
    },
    {
      title: "In Progress",
      value: objectives.filter(obj => !obj.desiredOutcome.includes("100%")).length,
      icon: Clock,
      color: "text-orange-500"
    },
    {
      title: "Active Initiatives",
      value: [...new Set(objectives.map(obj => obj.initiative))].length,
      icon: Activity,
      color: "text-purple-500"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 animate-fade-in">
      {stats.map((stat, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardContent className="flex items-center p-4">
            <div className={`mr-4 ${stat.color}`}>
              <stat.icon className="h-8 w-8" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
              <h3 className="text-2xl font-bold">{stat.value}</h3>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}