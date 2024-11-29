import { Project } from '@/lib/types';
import { defaultTechDomains } from '@/lib/types/techDomain';
import { DataQuantities } from '@/components/data/SampleData';
import { generateSampleSPIs, generateSampleObjectives, generateSampleSitReps } from './spiGenerator';

const generateBasicProject = (index: number, deptId: string): Project => ({
  id: `${deptId}-project-${index + 1}`,
  name: `Project ${index + 1}`,
  departmentId: deptId,
  poc: `POC ${index + 1}`,
  pocDepartment: deptId,
  techLead: `Tech Lead ${index + 1}`,
  techLeadDepartment: deptId,
  budget: 1000000,
  spent: 500000,
  status: "active",
  collaborators: [],
  internalPartners: [],
  techDomainId: defaultTechDomains[0].id,
  nabc: {
    needs: `Needs for Project ${index + 1}`,
    approach: `Approach for Project ${index + 1}`,
    benefits: `Benefits for Project ${index + 1}`,
    competition: `Competition analysis for Project ${index + 1}`
  },
  milestones: [],
  metrics: [],
  isSampleData: true
});

export const generateSampleProjects = async (quantities: DataQuantities) => {
  const projects = Array.from({ length: quantities.projects }, (_, i) => 
    generateBasicProject(i, ['engineering', 'techlab', 'it'][i % 3])
  );

  const spis = generateSampleSPIs(projects.map(p => p.id), quantities.spis);
  const objectives = generateSampleObjectives(quantities.objectives);
  const sitreps = generateSampleSitReps(spis, quantities.sitreps);

  return { projects, spis, objectives, sitreps };
};