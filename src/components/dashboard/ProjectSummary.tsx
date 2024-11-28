import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from '@/lib/db';
import { Project } from '@/lib/types';
import { BarChart, Activity, Timer, DollarSign } from 'lucide-react';

export default function ProjectSummary() {
  const [totalProjects, setTotalProjects] = useState(0);
  const [activeProjects, setActiveProjects] = useState(0);
  const [totalBudget, setTotalBudget] = useState(0);
  const [totalBusinessImpact, setTotalBusinessImpact] = useState(0);

  useEffect(() => {
    const loadSummary = async () => {
      await db.init();
      const projects = await db.getAllProjects();
      setTotalProjects(projects.length);
      setActiveProjects(projects.filter(p => p.status === 'active').length);
      setTotalBudget(projects.reduce((sum, p) => sum + p.budget, 0));
      setTotalBusinessImpact(projects.reduce((sum, p) => sum + (p.businessImpact || 0), 0));
    };

    loadSummary();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
          <BarChart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalProjects}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeProjects}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Business Impact</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${(totalBusinessImpact / 1000000).toFixed(1)}M
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
          <Timer className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${(totalBudget / 1000000).toFixed(1)}M
          </div>
        </CardContent>
      </Card>
    </div>
  );
}