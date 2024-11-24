import { Department } from '@/lib/types';

export interface InternalEmployee {
  id: string;
  name: string;
  role: string;
  department: Department;
  email: string;
  projects: string[];
}

export const generateEmployeeData = (departments: Department[]): InternalEmployee[] => {
  const employees: InternalEmployee[] = [];
  
  const roles = [
    'Senior Project Manager',
    'Technical Architect',
    'Systems Engineer',
    'Program Director',
    'IT Lead',
    'Research Lead',
    'Development Manager',
    'Innovation Lead',
    'Operations Manager',
    'Integration Specialist'
  ];

  const firstNames = [
    'Sarah', 'Michael', 'David', 'Emily', 'James', 
    'Lisa', 'Robert', 'Maria', 'John', 'Amanda', 
    'Thomas', 'Rachel', 'Daniel', 'Jessica', 'William',
    'Jennifer', 'Christopher', 'Elizabeth', 'Andrew', 'Patricia'
  ];

  const lastNames = [
    'Johnson', 'Chen', 'Rodriguez', 'Thompson', 'Wilson',
    'Anderson', 'Kim', 'Garcia', 'Smith', 'Lee',
    'Brown', 'Martinez', 'Taylor', 'Patel', 'Williams',
    'Davis', 'Miller', 'Singh', 'Clark', 'White'
  ];

  // Generate more employees per department to ensure enough unique people
  departments.forEach((dept) => {
    // Generate 3-4 employees per department
    const empCount = Math.floor(Math.random() * 2) + 3;
    
    for (let i = 0; i < empCount; i++) {
      const role = roles[Math.floor(Math.random() * roles.length)];
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      
      employees.push({
        id: `emp-${dept.id}-${i + 1}`,
        name: `${firstName} ${lastName}`,
        role,
        department: dept,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@company.com`,
        projects: []
      });
    }
  });

  return employees;
};