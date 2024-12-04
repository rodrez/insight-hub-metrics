import { generateFortune30Partners } from './generators/fortune30Generator';
import { generateInternalPartners } from './generators/internalPartnersGenerator';
import { generateSMEPartners } from './generators/smePartnersGenerator';
import { generateProjects } from './generators/projectGenerator';
import { DataQuantities } from '@/lib/types/data';
import { errorHandler } from '../error/ErrorHandlingService';
import { validateCollaborator } from './utils/dataGenerationUtils';
import { getRandomRatMember, getAllRatMembers } from './utils/ratMemberUtils';
import { DEPARTMENTS } from '@/lib/constants';
import { generateSampleSPIs, generateSampleObjectives, generateSampleSitReps } from '../sampleData/spiData';

export const generateSampleData = async (internalPartners: any[], quantities: DataQuantities) => {
  try {
    console.log('Starting sample data generation with quantities:', quantities);
    
    // Get all RAT members upfront
    const ratMembers = getAllRatMembers();
    console.log('Available RAT members:', ratMembers);

    // Generate partners with explicit RAT member assignment
    const fortune30Partners = generateFortune30Partners()
      .filter(validateCollaborator)
      .slice(0, quantities.fortune30)
      .map(partner => ({
        ...partner,
        ratMember: getRandomRatMember()
      }));

    const smePartners = generateSMEPartners()
      .filter(validateCollaborator)
      .slice(0, quantities.smePartners)
      .map(partner => ({
        ...partner,
        ratMember: getRandomRatMember()
      }));

    // Generate exactly the requested number of projects
    const projects = generateProjects(DEPARTMENTS, quantities.projects)
      .map(project => ({
        ...project,
        ratMember: getRandomRatMember()
      }));

    // Generate SPIs, objectives, and sitreps with exact counts
    const spis = generateSampleSPIs(
      projects.map(p => p.id),
      quantities.spis
    );

    const objectives = generateSampleObjectives(quantities.objectives);
    const sitreps = generateSampleSitReps(spis, quantities.sitreps);

    // Log generated data for verification
    console.log('Generated data counts:', {
      fortune30: fortune30Partners.length,
      internalPartners: internalPartners.length,
      smePartners: smePartners.length,
      projects: projects.length,
      spis: spis.length,
      objectives: objectives.length,
      sitreps: sitreps.length
    });

    return {
      projects,
      spis,
      objectives,
      sitreps,
      fortune30Partners,
      internalPartners: internalPartners.slice(0, quantities.internalPartners),
      smePartners
    };
  } catch (error) {
    console.error('Error generating sample data:', error);
    errorHandler.handleError(error, {
      type: 'database',
      title: 'Sample Data Generation Failed',
    });
    throw error;
  }
};