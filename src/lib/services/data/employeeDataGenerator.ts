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
    'Research Lead'
  ];

  departments.forEach((dept, index) => {
    // Generate 2-3 employees per department
    const empCount = Math.floor(Math.random() * 2) + 2;
    
    for (let i = 0; i < empCount; i++) {
      const role = roles[Math.floor(Math.random() * roles.length)];
      const firstName = ['Sarah', 'Michael', 'David', 'Emily', 'James', 'Lisa', 'Robert', 'Maria', 'John', 'Amanda', 'Thomas', 'Rachel'][Math.floor(Math.random() * 12)];
      const lastName = ['Johnson', 'Chen', 'Rodriguez', 'Thompson', 'Wilson', 'Anderson', 'Kim', 'Garcia', 'Smith', 'Lee', 'Brown', 'Martinez'][Math.floor(Math.random() * 12)];
      
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