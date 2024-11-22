import { DEPARTMENTS } from '@/lib/constants';
import DepartmentCard from '@/components/dashboard/DepartmentCard';
import ProjectSummary from '@/components/dashboard/ProjectSummary';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  return (
    <div className="container mx-auto px-4 pt-24 pb-12">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      <ProjectSummary />
      
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