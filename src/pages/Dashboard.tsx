import ProjectSummary from "@/components/dashboard/ProjectSummary";
import ProjectList from "@/components/projects/ProjectList";

export default function Dashboard() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Project Dashboard</h1>
      <ProjectSummary />
      <ProjectList />
    </div>
  );
}