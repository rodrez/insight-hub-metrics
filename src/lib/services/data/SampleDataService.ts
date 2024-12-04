import { generateFortune30Partners } from './generators/fortune30Generator';
import { generateInternalPartners } from './generators/internalPartnersGenerator';
import { generateSMEPartners } from './generators/smePartnersGenerator';
import { generateProjects } from './generators/projectGenerator';
import { DataQuantities } from '@/lib/types/data';
import { errorHandler } from '../error/ErrorHandlingService';
import { validateCollaborator } from './utils/dataGenerationUtils';
import { getRandomRatMember, getAllRatMembers } from './utils/ratMemberUtils';
import { DEPARTMENTS } from '@/lib/constants';

export class SampleDataService {
  async generateSampleData(quantities: DataQuantities) {
    try {
      console.log('Starting sample data generation with quantities:', quantities);
      
      // Get all RAT members upfront
      const ratMembers = getAllRatMembers();
      console.log('Available RAT members:', ratMembers);

      // Generate partners with explicit RAT member assignment
      const fortune30Partners = generateFortune30Partners().filter(validateCollaborator)
        .map(partner => ({
          ...partner,
          ratMember: getRandomRatMember()
        }));

      const internalPartners = generateInternalPartners().filter(validateCollaborator)
        .map(partner => ({
          ...partner,
          ratMember: getRandomRatMember()
        }));

      const smePartners = generateSMEPartners().filter(validateCollaborator)
        .map(partner => ({
          ...partner,
          ratMember: getRandomRatMember()
        }));

      // Generate projects with explicit RAT member assignment
      const projects = generateProjects([...DEPARTMENTS], quantities.projects)
        .map(project => ({
          ...project,
          ratMember: getRandomRatMember()
        }));

      // Log generated data for verification
      console.log('Generated Fortune 30 partners:', fortune30Partners.length);
      console.log('Generated internal partners:', internalPartners.length);
      console.log('Generated SME partners:', smePartners.length);
      console.log('Generated projects:', projects.length);

      return {
        fortune30Partners: fortune30Partners.slice(0, quantities.fortune30),
        internalPartners: internalPartners.slice(0, quantities.internalPartners),
        smePartners: smePartners.slice(0, quantities.smePartners),
        projects: projects.slice(0, quantities.projects)
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