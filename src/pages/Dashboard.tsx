import ProjectSummary from "@/components/dashboard/ProjectSummary";
import ProjectList from "@/components/projects/ProjectList";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Project Dashboard</h1>
        <Button 
          onClick={() => navigate('/projects/new')} 
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Project
        </Button>
      </div>
      <ProjectSummary />
      <ProjectList />
    </div>
  );
}