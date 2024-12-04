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
import { Department } from '@/lib/types';
import { toast } from "@/components/ui/use-toast";

export const generateSampleData = async (internalPartners: any[], quantities: DataQuantities) => {
  try {
    console.log('Starting sample data generation with exact quantities:', quantities);
    
    // Get all RAT members upfront
    const ratMembers = getAllRatMembers();
    console.log('Available RAT members:', ratMembers);

    // Convert readonly array to mutable array
    const departments: Department[] = [...DEPARTMENTS];

    // Generate partners with explicit RAT member assignment and respect quantities
    console.log('Generating Fortune 30 partners...');
    const fortune30Partners = generateFortune30Partners()
      .filter(validateCollaborator)
      .slice(0, quantities.fortune30)
      .map(partner => ({
        ...partner,
        ratMember: getRandomRatMember()
      }));

    // Generate SME partners with exact quantity
    console.log('Generating SME partners...');
    const allSmePartners = generateSMEPartners();
    const smePartners = allSmePartners
      .slice(0, quantities.smePartners)
      .map(partner => ({
        ...partner,
        ratMember: getRandomRatMember()
      }));

    // Ensure we have enough internal partners
    const allInternalPartners = generateInternalPartners();
    const selectedInternalPartners = allInternalPartners.slice(0, quantities.internalPartners);

    // Generate exactly the requested number of projects
    console.log(`Generating exactly ${quantities.projects} projects...`);
    const projects = generateProjects(departments, quantities.projects)
      .slice(0, quantities.projects)
      .map(project => ({
        ...project,
        ratMember: getRandomRatMember()
      }));

    // Generate SPIs, objectives, and sitreps with exact counts
    console.log(`Generating exactly ${quantities.spis} SPIs...`);
    const spis = generateSampleSPIs(
      projects.map(p => p.id),
      quantities.spis
    ).slice(0, quantities.spis);

    console.log(`Generating exactly ${quantities.objectives} objectives...`);
    const objectives = generateSampleObjectives(quantities.objectives)
      .slice(0, quantities.objectives);

    console.log(`Generating exactly ${quantities.sitreps} sitreps...`);
    const sitreps = generateSampleSitReps(spis, quantities.sitreps)
      .slice(0, quantities.sitreps);

    // Verify exact counts match requested quantities
    const finalCounts = {
      fortune30: fortune30Partners.length,
      internalPartners: selectedInternalPartners.length,
      smePartners: smePartners.length,
      projects: projects.length,
      spis: spis.length,
      objectives: objectives.length,
      sitreps: sitreps.length
    };

    console.log('Final generated data counts:', finalCounts);
    console.log('Requested quantities:', quantities);

    return {
      projects,
      spis,
      objectives,
      sitreps,
      fortune30Partners,
      internalPartners: selectedInternalPartners,
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