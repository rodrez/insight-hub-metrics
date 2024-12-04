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
    console.log(`Generated exactly ${fortune30Partners.length} Fortune 30 partners (requested: ${quantities.fortune30})`);

    console.log('Generating SME partners...');
    const smePartners = generateSMEPartners()
      .filter(validateCollaborator)
      .slice(0, quantities.smePartners)
      .map(partner => ({
        ...partner,
        ratMember: getRandomRatMember()
      }));
    console.log(`Generated exactly ${smePartners.length} SME partners (requested: ${quantities.smePartners})`);

    // Generate exactly the requested number of projects
    console.log(`Generating exactly ${quantities.projects} projects...`);
    const projects = generateProjects(departments, quantities.projects)
      .slice(0, quantities.projects)
      .map(project => ({
        ...project,
        ratMember: getRandomRatMember()
      }));
    console.log(`Generated exactly ${projects.length} projects (requested: ${quantities.projects})`);

    // Generate SPIs, objectives, and sitreps with exact counts
    console.log(`Generating exactly ${quantities.spis} SPIs...`);
    const spis = generateSampleSPIs(
      projects.map(p => p.id),
      quantities.spis
    ).slice(0, quantities.spis);
    console.log(`Generated exactly ${spis.length} SPIs (requested: ${quantities.spis})`);

    console.log(`Generating exactly ${quantities.objectives} objectives...`);
    const objectives = generateSampleObjectives(quantities.objectives)
      .slice(0, quantities.objectives);
    console.log(`Generated exactly ${objectives.length} objectives (requested: ${quantities.objectives})`);

    console.log(`Generating exactly ${quantities.sitreps} sitreps...`);
    const sitreps = generateSampleSitReps(spis, quantities.sitreps)
      .slice(0, quantities.sitreps);
    console.log(`Generated exactly ${sitreps.length} sitreps (requested: ${quantities.sitreps})`);

    // Verify exact counts match requested quantities
    const finalCounts = {
      fortune30: fortune30Partners.length,
      internalPartners: internalPartners.length,
      smePartners: smePartners.length,
      projects: projects.length,
      spis: spis.length,
      objectives: objectives.length,
      sitreps: sitreps.length
    };

    console.log('Final generated data counts:', finalCounts);
    console.log('Requested quantities:', quantities);
    
    // Verify counts match requested quantities
    const mismatches = Object.entries(finalCounts).filter(
      ([key, count]) => count !== quantities[key as keyof typeof quantities]
    );

    if (mismatches.length > 0) {
      console.error('Quantity mismatches:', mismatches);
      throw new Error(`Generated quantities don't match requested amounts: ${JSON.stringify(mismatches)}`);
    }

    console.log('All quantities match exactly as requested');
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