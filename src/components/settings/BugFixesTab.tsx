import { bugTracker } from "@/lib/services/error/BugTrackingService";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";

export function BugFixesTab() {
  const [bugs, setBugs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const sortBugsBySeverity = (bugsToSort: any[]) => {
    const severityOrder = {
      'critical': 0,
      'high': 1,
      'medium': 2,
      'low': 3
    };

    return [...bugsToSort].sort((a, b) => 
      severityOrder[a.severity as keyof typeof severityOrder] - 
      severityOrder[b.severity as keyof typeof severityOrder]
    );
  };

  const loadBugs = async () => {
    try {
      console.log('Loading bugs...');
      const fetchedBugs = await bugTracker.getAllBugs();
      console.log('Fetched bugs:', fetchedBugs);
      const sortedBugs = sortBugsBySeverity(fetchedBugs);
      setBugs(sortedBugs);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading bugs:', error);
      toast({
        title: "Error loading bugs",
        description: "Failed to load the bug list",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBugs();
  }, []);

  const handleResolveBug = async (bugId: string) => {
    try {
      await bugTracker.updateBugStatus(bugId, 'resolved');
      setBugs(prevBugs => 
        prevBugs.map(bug => 
          bug.id === bugId ? { ...bug, status: 'resolved' } : bug
        )
      );
      toast({
        title: "Bug resolved",
        description: "The bug has been marked as resolved",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to resolve the bug",
        variant: "destructive",
      });
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500';
      case 'high':
        return 'bg-orange-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (isLoading) {
    return <div>Loading bugs...</div>;
  }

  return (
    <ScrollArea className="h-[600px] pr-4">
      <div className="space-y-4">
        <div className="flex gap-2 mb-4">
          <Badge variant="outline">Critical: {bugs.filter(b => b.severity === 'critical').length}</Badge>
          <Badge variant="outline">High: {bugs.filter(b => b.severity === 'high').length}</Badge>
          <Badge variant="outline">Medium: {bugs.filter(b => b.severity === 'medium').length}</Badge>
          <Badge variant="outline">Low: {bugs.filter(b => b.severity === 'low').length}</Badge>
        </div>
        
        {bugs.map((bug) => (
          <Card key={bug.id} className="p-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge className={getSeverityColor(bug.severity)}>{bug.severity}</Badge>
                  <span className="text-sm text-muted-foreground">{bug.id}</span>
                </div>
                <h3 className="text-lg font-semibold">{bug.title}</h3>
                <p className="text-sm text-muted-foreground">{bug.description}</p>
                
                <div className="space-y-1 mt-4">
                  <p className="text-sm"><strong>Location:</strong> {bug.location}</p>
                  <p className="text-sm"><strong>Impact:</strong> {bug.impact}</p>
                  {bug.stepsToReproduce && (
                    <p className="text-sm"><strong>Steps to Reproduce:</strong> {bug.stepsToReproduce}</p>
                  )}
                  <p className="text-sm"><strong>Suggested Fix:</strong> {bug.suggestedFix}</p>
                </div>
              </div>
              
              <Button
                variant={bug.status === 'resolved' ? 'secondary' : 'outline'}
                onClick={() => handleResolveBug(bug.id)}
                className="ml-4"
                disabled={bug.status === 'resolved'}
              >
                {bug.status === 'resolved' ? 'Resolved' : 'Mark as Resolved'}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}