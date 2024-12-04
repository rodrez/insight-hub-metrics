import { generateFortune30Partners } from './generators/fortune30Generator';
import { generateInternalPartners } from './generators/internalPartnersGenerator';
import { generateSMEPartners } from './generators/smePartnersGenerator';
import { generateProjects } from './generators/projectGenerator';
import { DataQuantities } from '@/lib/types/data';
import { errorHandler } from '../error/ErrorHandlingService';
import { validateCollaborator } from './utils/dataGenerationUtils';
import { getRandomRatMember } from './utils/ratMemberUtils';

export class SampleDataService {
  async generateSampleData(quantities: DataQuantities) {
    try {
      console.log('Starting sample data generation with quantities:', quantities);
      
      const fortune30Partners = generateFortune30Partners().filter(validateCollaborator);
      const internalPartners = generateInternalPartners().filter(validateCollaborator);
      const smePartners = generateSMEPartners().filter(validateCollaborator);

      // Ensure we generate at least 5 projects
      const minProjects = Math.max(5, quantities.projects);
      console.log('Generating minimum projects:', minProjects);

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
        collaborators: internalPartners.slice(0, quantities.internalPartners)
      };

      const projects = generateProjects(projectInput.departments, projectInput.projects);

      // Assign RAT members to all entities
      const projectsWithRAT = projects.map(project => ({
        ...project,
        ratMember: getRandomRatMember()
      }));

      const fortune30WithRAT = fortune30Partners.map(partner => ({
        ...partner,
        ratMember: getRandomRatMember(),
        workstreams: (partner.workstreams || []).map(ws => ({
          ...ws,
          ratMember: getRandomRatMember()
        }))
      }));

      const smePartnersWithRAT = smePartners.map(partner => ({
        ...partner,
        ratMember: getRandomRatMember()
      }));

      return {
        fortune30Partners: fortune30WithRAT.slice(0, quantities.fortune30),
        internalPartners: internalPartners.slice(0, quantities.internalPartners),
        smePartners: smePartnersWithRAT.slice(0, quantities.smePartners),
        projects: projectsWithRAT.slice(0, quantities.projects)
      };
    } catch (error) {
      console.error('Error generating sample data:', error);
      errorHandler.handleError(error, {
        type: 'database',
        title: 'Sample Data Generation Failed',
      });
      throw error;
    }
  }
}