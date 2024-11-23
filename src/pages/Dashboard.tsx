import { DEPARTMENTS } from '@/lib/constants';
import DepartmentCard from '@/components/dashboard/DepartmentCard';
import ProjectSummary from '@/components/dashboard/ProjectSummary';
import ProjectList from '@/components/projects/ProjectList';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { runIntegrityChecks } from '@/lib/utils/integrityChecks';
import { toast } from '@/components/ui/use-toast';
import { db } from '@/lib/db';

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeData = async () => {
      const loadingToast = toast({
        title: "Initializing Dashboard",
        description: "Loading application data...",
        variant: "default",
      });

      try {
        // Initialize database
        await db.init();
        
        // Run integrity checks
        const results = await runIntegrityChecks();
        
        // If critical checks fail, try to repopulate data
        if (!results.projects || !results.fortune30Partners || !results.internalPartners) {
          toast({
            title: "Attempting Data Recovery",
            description: "Repopulating sample data...",
            variant: "default",
          });
          
          await db.clear();
          await db.init();
          await db.populateSampleData();
          
          // Run integrity checks again
          const retryResults = await runIntegrityChecks();
          
          if (!retryResults.projects || !retryResults.fortune30Partners || !retryResults.internalPartners) {
            toast({
              title: "Data Recovery Failed",
              description: "Please contact an administrator for assistance.",
              variant: "destructive",
            });
          }
        }
      } catch (error) {
        console.error('Dashboard initialization failed:', error);
        toast({
          title: "Initialization Failed",
          description: "Please contact an administrator for assistance.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 pt-24 pb-12 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Loading Dashboard...</h2>
          <p className="text-muted-foreground">Please wait while we verify data integrity</p>
        </div>
      </div>
    );
  }

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