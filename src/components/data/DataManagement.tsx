import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { db } from "@/lib/db";
import { useEffect, useState } from "react";
import { DEPARTMENTS } from "@/lib/constants";

export default function DataManagement() {
  const [isInitialized, setIsInitialized] = useState(false);

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

  const populateSampleData = async () => {
    try {
      const fortune30Companies = [
        { name: "Walmart", color: "#0071CE" },
        { name: "Amazon", color: "#FF9900" },
        { name: "Apple", color: "#555555" },
        { name: "CVS Health", color: "#CC0000" },
        { name: "UnitedHealth Group", color: "#002677" }
      ];

      for (const dept of DEPARTMENTS) {
        const projectCount = dept.projectCount;
        for (let i = 0; i < projectCount; i++) {
          const budget = Math.round(dept.budget / projectCount);
          const spent = Math.round(budget * (Math.random() * 0.8)); // Random spent amount up to 80% of budget

          const project = {
            id: `${dept.id}-project-${i + 1}`,
            name: `${dept.name} Project ${i + 1}`,
            departmentId: dept.id,
            poc: "John Doe",
            techLead: "Jane Smith",
            budget,
            spent,
            status: "active" as const,
            collaborators: [
              {
                id: `collab-fortune-${i}`,
                name: fortune30Companies[i % fortune30Companies.length].name,
                type: "fortune30" as const,
                color: fortune30Companies[i % fortune30Companies.length].color,
                role: "Strategic Partner"
              },
              {
                id: `collab-other-${i}`,
                name: `Tech Partner ${i + 1}`,
                type: "other" as const,
                color: "#6E59A5",
                role: "Technology Provider"
              }
            ],
            nabc: {
              needs: `Sample needs for ${dept.name}`,
              approach: `Sample approach for ${dept.name}`,
              benefits: `Sample benefits for ${dept.name}`,
              competition: `Sample competition analysis for ${dept.name}`,
            },
            milestones: [
              {
                id: `${dept.id}-milestone-1`,
                title: "Initial Phase",
                description: "Project initialization and planning",
                dueDate: new Date(
                  Date.now() + 30 * 24 * 60 * 60 * 1000
                ).toISOString(),
                status: "in-progress" as const,
                progress: 65
              },
              {
                id: `${dept.id}-milestone-2`,
                title: "Development Phase",
                description: "Core development and testing",
                dueDate: new Date(
                  Date.now() + 60 * 24 * 60 * 60 * 1000
                ).toISOString(),
                status: "pending" as const,
                progress: 0
              }
            ],
            metrics: [
              {
                id: `${dept.id}-metric-1`,
                name: "Progress",
                value: Math.round(Math.random() * 100),
                target: 100,
                unit: "%",
                trend: "up" as const,
                description: "Overall project completion progress"
              },
              {
                id: `${dept.id}-metric-2`,
                name: "Efficiency",
                value: Math.round(Math.random() * 95),
                target: 95,
                unit: "%",
                trend: "stable" as const,
                description: "Resource utilization efficiency"
              }
            ],
          };
          await db.addProject(project);
        }
      }
      toast({
        title: "Sample data populated",
        description: "Sample projects have been added to the database.",
      });
    } catch (error) {
      toast({
        title: "Error populating data",
        description: "There was an error adding sample data.",
        variant: "destructive",
      });
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
        <Button
          onClick={populateSampleData}
          disabled={!isInitialized}
          variant="outline"
        >
          Populate Sample Data
        </Button>
        <Button onClick={handleExport} disabled={!isInitialized}>
          Export Data
        </Button>
      </div>
    </div>
  );
}