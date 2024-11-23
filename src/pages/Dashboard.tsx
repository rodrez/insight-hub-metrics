import { DEPARTMENTS } from '@/lib/constants';
import DepartmentCard from '@/components/dashboard/DepartmentCard';
import ProjectSummary from '@/components/dashboard/ProjectSummary';
import ProjectList from '@/components/projects/ProjectList';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { runIntegrityChecks } from '@/lib/utils/integrityChecks';
import { toast } from '@/components/ui/use-toast';

export default function Dashboard() {
  useEffect(() => {
    const checkIntegrity = async () => {
      toast({
        title: "Running Integrity Checks",
        description: "Verifying data integrity...",
      });
      
      try {
        await runIntegrityChecks();
      } catch (error) {
        console.error('Integrity check failed:', error);
      }
    };

    checkIntegrity();
  }, []);

  return (
    <div className="container mx-auto px-4 pt-24 pb-12">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      <ProjectSummary />

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Project Overview</h2>
        <ProjectList />
      </div>
      
      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-4">Business Units</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {DEPARTMENTS.filter(d => d.type === 'business').map(department => (
              <Link 
                key={department.id} 
                to={`/departments/${department.id}`}
                className="transition-transform hover:scale-105"
              >
                <DepartmentCard department={department} />
              </Link>
            ))}
          </div>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-4">Functional Areas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {DEPARTMENTS.filter(d => d.type === 'functional').map(department => (
              <Link 
                key={department.id} 
                to={`/departments/${department.id}`}
                className="transition-transform hover:scale-105"
              >
                <DepartmentCard department={department} />
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}