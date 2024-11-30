import { bugTracker } from "@/lib/services/error/BugTrackingService";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

export function BugFixesTab() {
  const [bugs, setBugs] = useState<any[]>([]);
  const [previousBugIds, setPreviousBugIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Initialize bugs on component mount
    const initialBugs = bugTracker.getAllBugs();
    setBugs(initialBugs);
    setPreviousBugIds(new Set(initialBugs.map(bug => bug.id)));
  }, []);

  const refreshBugs = () => {
    try {
      const currentBugIds = new Set(bugs.map(bug => bug.id));
      const newBugs = bugTracker.getAllBugs();
      setBugs(newBugs);
      
      // Check for new bugs
      const newBugCount = newBugs.filter(bug => !currentBugIds.has(bug.id)).length;
      
      if (newBugCount > 0) {
        toast({
          title: "New bugs found!",
          description: `${newBugCount} new bug${newBugCount > 1 ? 's' : ''} have been detected`,
          variant: "default",
        });
      } else {
        toast({
          title: "Bug list refreshed",
          description: "No new bugs found",
        });
      }
      
      setPreviousBugIds(currentBugIds);
    } catch (error) {
      toast({
        title: "Error refreshing bugs",
        description: "Failed to refresh the bug list",
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

  const isNewBug = (bugId: string) => {
    return !previousBugIds.has(bugId);
  };

  return (
    <ScrollArea className="h-[600px] pr-4">
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-2">
            <Badge variant="outline">Critical: {bugs.filter(b => b.severity === 'critical').length}</Badge>
            <Badge variant="outline">High: {bugs.filter(b => b.severity === 'high').length}</Badge>
            <Badge variant="outline">Medium: {bugs.filter(b => b.severity === 'medium').length}</Badge>
            <Badge variant="outline">Low: {bugs.filter(b => b.severity === 'low').length}</Badge>
          </div>
          <Button onClick={refreshBugs} size="sm" variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Bugs
          </Button>
        </div>
        
        {bugs.map((bug) => (
          <Card key={bug.id} className={`p-4 ${isNewBug(bug.id) ? 'ring-2 ring-blue-500' : ''}`}>
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge className={getSeverityColor(bug.severity)}>{bug.severity}</Badge>
                  <span className="text-sm text-muted-foreground">{bug.id}</span>
                  {isNewBug(bug.id) && (
                    <Badge variant="secondary" className="bg-blue-100">New</Badge>
                  )}
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
                onClick={() => bugTracker.updateBugStatus(bug.id, 'resolved')}
                className="ml-4"
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