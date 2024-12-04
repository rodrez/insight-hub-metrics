import { Project } from '@/lib/types';
import { Department } from '@/lib/types';
import { getAllRatMembers } from '../utils/ratMemberUtils';

const ratMembers = getAllRatMembers();

export const generateProjects = (departments: Department[], count: number = 5): Project[] => {
  return Array.from({ length: count }, (_, index) => {
    const dept = departments[index % departments.length];
    const ratMember = ratMembers[index % ratMembers.length];
    
    return {
      id: `project-${index + 1}`,
      name: `Project ${index + 1}`,
      departmentId: dept.id,
      poc: `POC ${index + 1}`,
      pocDepartment: dept.id,
      techLead: `Tech Lead ${index + 1}`,
      techLeadDepartment: dept.id,
      budget: 100000 + (index * 50000),
      spent: (50000 + (index * 20000)),
      status: 'active',
      collaborators: [],
      ratMember: ratMember
    };
  });
};