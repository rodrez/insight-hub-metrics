import { Project, Collaborator } from '@/lib/types';
import { DEPARTMENTS } from '@/lib/constants';
import { generateFortune30Partners } from './generators/fortune30Generator';
import { generateInternalPartners } from './generators/internalPartnersGenerator';
import { generateSMEPartners } from './generators/smePartnersGenerator';
import { generateProjects } from './generators/projectGenerator';
import { generateSampleSPIs, generateSampleObjectives, generateSampleSitReps } from './spiData';

export class SampleDataService {
  async generateSampleData() {
    const fortune30Partners = generateFortune30Partners();
    const internalPartners = generateInternalPartners();
    const smePartners = generateSMEPartners();
    
    const projects = generateProjects(
      DEPARTMENTS,
      internalPartners,
      fortune30Partners
    );
    
    const spis = generateSampleSPIs(projects.map(p => p.id));
    const objectives = generateSampleObjectives();
    const sitreps = generateSampleSitReps(spis);
    
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