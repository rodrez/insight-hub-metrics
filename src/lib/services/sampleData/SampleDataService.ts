import { Project, Collaborator } from '@/lib/types';
import { generateFortune30Partners } from '@/lib/services/data/fortune30Partners';
import { generateInternalPartners } from '@/lib/services/data/internalPartners';
import { generateSMEPartners } from '@/lib/services/data/smePartners';
import { generateSampleProjects } from '@/components/data/SampleData';
import { generateSampleSPIs, generateSampleObjectives, generateSampleSitReps } from './spiData';
import { SampleDataQuantities } from '../DataService';

export class SampleDataService {
  async generateSampleData(quantities: SampleDataQuantities = {
    projects: 10,
    spis: 10,
    objectives: 5,
    sitreps: 10,
    fortune30: 6,
    internalPartners: 20,
    smePartners: 10
  }) {
    try {
      console.log('Starting sample data generation...');
      
      const fortune30Partners = generateFortune30Partners().slice(0, quantities.fortune30);
      const internalPartners = await generateInternalPartners();
      const smePartners = generateSMEPartners().slice(0, quantities.smePartners);
      
      console.log('Generated partners data');
      
      // Generate projects and related data
      const { projects, spis, objectives, sitreps } = await generateSampleProjects(quantities);
      
      console.log('Generated projects and related data');
      
      return {
        fortune30Partners,
        internalPartners: internalPartners.slice(0, quantities.internalPartners),
        smePartners,
        projects: projects.slice(0, quantities.projects),
        spis: spis.slice(0, quantities.spis),
        objectives: objectives.slice(0, quantities.objectives),
        sitreps: sitreps.slice(0, quantities.sitreps)
      };
    } catch (error) {
      console.error('Error in sample data generation:', error);
      throw error;
    }
  }
}