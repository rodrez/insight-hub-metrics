import { bugTracker } from "@/lib/services/error/BugTrackingService";
import { CodeAnalysisService, CodeIssue } from "@/lib/services/analysis/CodeAnalysisService";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useEffect } from "react";
import { RefreshCw, AlertTriangle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function BugFixesTab() {
  const [bugs, setBugs] = useState<any[]>([]);
  const [automaticIssues, setAutomaticIssues] = useState<CodeIssue[]>([]);
  const [previousBugIds, setPreviousBugIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [issueFilter, setIssueFilter] = useState<string>("all");
  const analysisService = new CodeAnalysisService();

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
      setIsLoading(true);
      const [fetchedBugs, detectedIssues] = await Promise.all([
        bugTracker.getAllBugs(),
        analysisService.detectIssues()
      ]);
      
      const sortedBugs = sortBugsBySeverity(fetchedBugs);
      setBugs(sortedBugs);
      setAutomaticIssues(detectedIssues);
      setPreviousBugIds(new Set(sortedBugs.map(bug => bug.id)));
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

  const refreshBugs = async () => {
    try {
      const currentBugIds = new Set(bugs.map(bug => bug.id));
      
      // Get fresh bugs and detected issues
      const [newBugs, newIssues] = await Promise.all([
        bugTracker.getAllBugs(),
        analysisService.detectIssues()
      ]);
      
      const sortedBugs = sortBugsBySeverity(newBugs);
      setBugs(sortedBugs);
      setAutomaticIssues(newIssues);
      
      // Check for new bugs (ones that weren't in the previous set)
      const newBugCount = newBugs.filter(bug => !currentBugIds.has(bug.id)).length;
      const newIssueCount = newIssues.length;
      
      if (newBugCount > 0 || newIssueCount > 0) {
        toast({
          title: "New issues found!",
          description: `Found ${newBugCount} new reported bug${newBugCount !== 1 ? 's' : ''} and ${newIssueCount} code issue${newIssueCount !== 1 ? 's' : ''}`,
          variant: "default",
        });
      } else {
        toast({
          title: "Scan complete",
          description: "No new issues found",
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

  const handleResolveBug = async (bugId: string) => {
    try {
      await bugTracker.updateBugStatus(bugId, 'resolved');
      // Update the local state to reflect the change
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

  const isNewBug = (bugId: string) => {
    return !previousBugIds.has(bugId);
  };

  const filteredIssues = [...bugs, ...automaticIssues].filter(issue => {
    if (issueFilter === "all") return true;
    if (issueFilter === "automatic") return 'automatic' in issue;
    if (issueFilter === "reported") return !('automatic' in issue);
    return true;
  });

  if (isLoading) {
    return <div>Loading bugs...</div>;
  }

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
          <div className="flex items-center gap-4">
            <Select value={issueFilter} onValueChange={setIssueFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter issues" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Issues</SelectItem>
                <SelectItem value="automatic">Detected Issues</SelectItem>
                <SelectItem value="reported">Reported Bugs</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={refreshBugs} size="sm" variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Scan for Issues
            </Button>
          </div>
        </div>
        
        {filteredIssues.map((bug) => (
          <Card key={bug.id} className={`p-4 ${isNewBug(bug.id) ? 'ring-2 ring-blue-500' : ''}`}>
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge className={getSeverityColor(bug.severity)}>{bug.severity}</Badge>
                  <span className="text-sm text-muted-foreground">{bug.id}</span>
                  {'automatic' in bug && (
                    <Badge variant="secondary" className="bg-purple-100">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Auto-detected
                    </Badge>
                  )}
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
                  {'detectedAt' in bug && (
                    <p className="text-sm"><strong>Detected:</strong> {new Date(bug.detectedAt).toLocaleString()}</p>
                  )}
                </div>
              </div>
              
              {!('automatic' in bug) && (
                <Button
                  variant={bug.status === 'resolved' ? 'secondary' : 'outline'}
                  onClick={() => handleResolveBug(bug.id)}
                  className="ml-4"
                  disabled={bug.status === 'resolved'}
                >
                  {bug.status === 'resolved' ? 'Resolved' : 'Mark as Resolved'}
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}