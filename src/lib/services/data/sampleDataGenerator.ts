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
    console.log('Starting sample data generation with quantities:', quantities);
    
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
    console.log(`Generated ${fortune30Partners.length} Fortune 30 partners`);

    console.log('Generating SME partners...');
    const smePartners = generateSMEPartners()
      .filter(validateCollaborator)
      .slice(0, quantities.smePartners)
      .map(partner => ({
        ...partner,
        ratMember: getRandomRatMember()
      }));
    console.log(`Generated ${smePartners.length} SME partners`);

    // Generate exactly the requested number of projects
    console.log(`Generating ${quantities.projects} projects...`);
    const projects = generateProjects(departments, quantities.projects)
      .map(project => ({
        ...project,
        ratMember: getRandomRatMember()
      }));
    console.log(`Generated ${projects.length} projects`);

    // Generate SPIs, objectives, and sitreps with exact counts
    console.log(`Generating ${quantities.spis} SPIs...`);
    const spis = generateSampleSPIs(
      projects.map(p => p.id),
      quantities.spis
    );
    console.log(`Generated ${spis.length} SPIs`);

    console.log(`Generating ${quantities.objectives} objectives...`);
    const objectives = generateSampleObjectives(quantities.objectives);
    console.log(`Generated ${objectives.length} objectives`);

    console.log(`Generating ${quantities.sitreps} sitreps...`);
    const sitreps = generateSampleSitReps(spis, quantities.sitreps);
    console.log(`Generated ${sitreps.length} sitreps`);

    // Log final counts for verification
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
    
    // Verify counts match requested quantities
    const mismatches = Object.entries(finalCounts).filter(
      ([key, count]) => count !== quantities[key as keyof typeof quantities]
    );

    if (mismatches.length > 0) {
      console.warn('Some quantities do not match requested amounts:', mismatches);
      toast({
        title: "Warning",
        description: "Some data quantities don't match requested amounts. Check the console for details.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Generated exact quantities of all requested data",
      });
    }

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