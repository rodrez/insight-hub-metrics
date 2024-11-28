import { Project, Collaborator } from '@/lib/types';
import { DEPARTMENTS } from '@/lib/constants';
import { generateFortune30Partners } from '../data/fortune30Partners';
import { generateInternalPartners } from '../data/internalPartners';
import { generateSMEPartners } from '../data/smePartners';
import { generateSampleProjects } from '../data/sampleProjectGenerator';
import { generateSampleSPIs, generateSampleObjectives, generateSampleSitReps } from './spiData';

export class SampleDataService {
  async generateSampleData() {
    const fortune30Partners = generateFortune30Partners();
    const internalPartners = await generateInternalPartners();
    const smePartners = generateSMEPartners();
    
    // Generate projects and related data
    const { projects, spis, objectives, sitreps } = await generateSampleProjects(fortune30Partners, internalPartners);
    
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