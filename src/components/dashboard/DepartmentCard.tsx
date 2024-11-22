import { Department } from '@/lib/types';

export default function DepartmentCard({ department }: { department: Department }) {
  return (
    <div 
      className="p-6 rounded-xl bg-card animate-fade-in"
      style={{ borderLeft: `4px solid ${department.color}` }}
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-semibold text-lg">{department.name}</h3>
        <span className="text-sm text-muted-foreground capitalize">{department.type}</span>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Projects</span>
          <span className="font-medium">{department.projectCount}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Budget</span>
          <span className="font-medium">
            ${(department.budget / 1000000).toFixed(1)}M
          </span>
        </div>
      </div>
    </div>
  );
}