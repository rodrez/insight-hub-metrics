import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { db } from "@/lib/db";
import { useEffect, useState } from "react";
import { DEPARTMENTS } from "@/lib/constants";
import { sampleFortune30, sampleInternalPartners } from "./SampleData";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export default function DataManagement() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [isPopulating, setIsPopulating] = useState(false);

  useEffect(() => {
    initializeDB();
  }, []);

  const initializeDB = async () => {
    try {
      await db.init();
      setIsInitialized(true);
      toast({
        title: "Database initialized",
        description: "The database has been successfully initialized.",
      });
    } catch (error) {
      toast({
        title: "Database initialization failed",
        description: "There was an error initializing the database.",
        variant: "destructive",
      });
    }
  };

  const clearDatabase = async () => {
    setIsClearing(true);
    try {
      await db.clear();
      await initializeDB();
      toast({
        title: "Database cleared",
        description: "The database has been successfully cleared.",
      });
    } catch (error) {
      toast({
        title: "Error clearing database",
        description: "There was an error clearing the database.",
        variant: "destructive",
      });
    } finally {
      setIsClearing(false);
    }
  };

  const populateSampleData = async () => {
    if (!isInitialized) {
      toast({
        title: "Error",
        description: "Please wait for database initialization to complete.",
        variant: "destructive",
      });
      return;
    }

    setIsPopulating(true);
    try {
      // Add collaborators to the database
      for (const collaborator of [...sampleFortune30, ...sampleInternalPartners]) {
        await db.addCollaborator(collaborator);
      }

      // Create projects for each department
      for (const dept of DEPARTMENTS) {
        const projectCount = dept.projectCount;
        for (let i = 0; i < projectCount; i++) {
          const budget = Math.round(dept.budget / projectCount);
          const spent = Math.round(budget * (Math.random() * 0.8));
          const startDate = new Date();

          const project = {
            id: `${dept.id}-project-${i + 1}`,
            name: `${dept.name} Innovation Project ${i + 1}`,
            departmentId: dept.id,
            poc: sampleInternalPartners[i % sampleInternalPartners.length].name,
            pocDepartment: dept.id,
            techLead: sampleInternalPartners[(i + 1) % sampleInternalPartners.length].name,
            techLeadDepartment: dept.id,
            budget,
            spent,
            status: "active" as const,
            collaborators: [
              sampleFortune30[i % sampleFortune30.length]
            ],
            nabc: {
              needs: `Developing next-generation ${dept.name.toLowerCase()} systems with improved efficiency and reduced environmental impact.`,
              approach: `Implementing advanced technologies and innovative solutions, combined with AI-driven optimization algorithms for maximum performance.`,
              benefits: `20% reduction in operational costs, 15% decrease in maintenance costs, and potential market leadership in eco-friendly solutions.`,
              competition: `Major competitors are investing in similar technologies, but our integrated approach provides a significant advantage in time-to-market.`,
            },
            milestones: [
              {
                id: `${dept.id}-milestone-1`,
                title: "Requirements & Planning",
                description: "Define technical specifications and project scope",
                dueDate: new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                status: "completed" as const,
                progress: 100
              },
              {
                id: `${dept.id}-milestone-2`,
                title: "Design Phase",
                description: "Complete system architecture and detailed design",
                dueDate: new Date(startDate.getTime() + 90 * 24 * 60 * 60 * 1000).toISOString(),
                status: "in-progress" as const,
                progress: 65
              },
              {
                id: `${dept.id}-milestone-3`,
                title: "Implementation",
                description: "Development and integration of core systems",
                dueDate: new Date(startDate.getTime() + 180 * 24 * 60 * 60 * 1000).toISOString(),
                status: "pending" as const,
                progress: 0
              }
            ],
            metrics: [
              {
                id: `${dept.id}-metric-1`,
                name: "Development Progress",
                value: Math.round(Math.random() * 100),
                target: 100,
                unit: "%",
                trend: "up" as const,
                description: "Overall project completion status"
              },
              {
                id: `${dept.id}-metric-2`,
                name: "Budget Utilization",
                value: Math.round((spent / budget) * 100),
                target: 100,
                unit: "%",
                trend: "stable" as const,
                description: "Current budget consumption vs allocation"
              },
              {
                id: `${dept.id}-metric-3`,
                name: "Resource Efficiency",
                value: Math.round(Math.random() * 90 + 10),
                target: 95,
                unit: "%",
                trend: "up" as const,
                description: "Team productivity and resource utilization"
              }
            ],
          };
          await db.addProject(project);
        }
      }
      toast({
        title: "Sample data populated",
        description: "Sample projects and collaborators have been added to the database.",
      });
    } catch (error) {
      console.error('Error populating data:', error);
      toast({
        title: "Error populating data",
        description: "There was an error adding sample data.",
        variant: "destructive",
      });
    } finally {
      setIsPopulating(false);
    }
  };

  const handleExport = async () => {
    try {
      await db.exportData();
      toast({
        title: "Data exported",
        description: "Project data has been exported successfully.",
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "There was an error exporting the data.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-2xl font-bold mb-4">Data Management</h2>
      <div className="flex flex-col gap-4">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" disabled={!isInitialized || isClearing}>
              Clear Database
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action will clear all data from the database. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={clearDatabase}>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        
        <Button
          onClick={populateSampleData}
          disabled={!isInitialized || isPopulating}
          variant="outline"
        >
          {isPopulating ? "Populating..." : "Populate Sample Data"}
        </Button>
        
        <Button onClick={handleExport} disabled={!isInitialized}>
          Export Data
        </Button>
      </div>
    </div>
  );
}