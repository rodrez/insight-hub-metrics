import { Project, Collaborator } from '@/lib/types';
import { generateFortune30Partners } from '@/lib/services/data/fortune30Partners';
import { generateInternalPartners } from '@/lib/services/data/internalPartners';
import { generateSMEPartners } from '@/lib/services/data/smePartners';
import { generateSampleProjects } from '@/components/data/SampleData';
import { generateSampleSPIs, generateSampleObjectives, generateSampleSitReps } from './spiData';

export class SampleDataService {
  async generateSampleData() {
    const fortune30Partners = generateFortune30Partners();
    const internalPartners = await generateInternalPartners();
    const smePartners = generateSMEPartners();
    
    // Generate projects and related data
    const { projects, spis, objectives, sitreps } = await generateSampleProjects({
      projects: 10,
      spis: 10,
      objectives: 5,
      sitreps: 10
    });
    
    return {
      fortune30Partners,
      internalPartners,
      smePartners,
      projects,
      spis,
      objectives,
      sitreps
    };
  }
}