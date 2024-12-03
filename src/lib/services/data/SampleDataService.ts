import { generateFortune30Partners } from './generators/fortune30Generator';
import { generateInternalPartners } from './generators/internalPartnersGenerator';
import { generateSMEPartners } from './generators/smePartnersGenerator';
import { generateSampleProjects } from './generators/projectGenerator';
import { DataQuantities } from '@/lib/types/data';
import { errorHandler } from '../error/ErrorHandlingService';
import { validateCollaborator } from './utils/dataGenerationUtils';
import { DEPARTMENTS } from '@/lib/constants';

const RAT_MEMBERS = [
  "Sarah Johnson",
  "Michael Chen",
  "Emily Rodriguez",
  "David Kim",
  "James Wilson",
  "Maria Garcia",
  "Robert Taylor"
];

export class SampleDataService {
  async generateSampleData(quantities: DataQuantities) {
    try {
      const fortune30Partners = generateFortune30Partners().filter(validateCollaborator);
      const internalPartners = generateInternalPartners().filter(validateCollaborator);
      const smePartners = generateSMEPartners().filter(validateCollaborator);

      // Ensure we generate at least 5 projects
      const minProjects = Math.max(5, quantities.projects);

      const projectInput = {
        projects: minProjects,
        spis: quantities.spis,
        objectives: quantities.objectives,
        sitreps: quantities.sitreps,
        fortune30: quantities.fortune30,
        internalPartners: quantities.internalPartners,
        smePartners: quantities.smePartners,
        departments: [...DEPARTMENTS],
        fortune30Partners: fortune30Partners.slice(0, quantities.fortune30),
        collaborators: internalPartners.slice(0, quantities.internalPartners),
        ratMembers: RAT_MEMBERS
      };

      const { projects, spis, objectives, sitreps } = await generateSampleProjects(projectInput);

      // Assign RAT members to projects and SPIs
      const assignRATMember = (index: number) => RAT_MEMBERS[index % RAT_MEMBERS.length];
      
      const projectsWithRAT = projects.map((project, index) => ({
        ...project,
        ratMember: assignRATMember(index)
      }));

      const spisWithRAT = spis.map((spi, index) => ({
        ...spi,
        ratMember: assignRATMember(index)
      }));

      return {
        fortune30Partners: fortune30Partners.slice(0, quantities.fortune30),
        internalPartners: internalPartners.slice(0, quantities.internalPartners),
        smePartners: smePartners.slice(0, quantities.smePartners),
        projects: projectsWithRAT.slice(0, quantities.projects),
        spis: spisWithRAT.slice(0, quantities.spis),
        objectives: objectives.slice(0, quantities.objectives),
        sitreps: sitreps.slice(0, quantities.sitreps)
      };
    } catch (error) {
      errorHandler.handleError(error, {
        type: 'database',
        title: 'Sample Data Generation Failed',
      });
      throw error;
    }
  }
}