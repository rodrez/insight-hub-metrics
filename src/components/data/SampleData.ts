import { generateFortune30Partners } from '@/lib/services/data/fortune30Partners';
import { generateInternalPartners } from '@/lib/services/data/internalPartners';
import { Project, Collaborator } from '@/lib/types';
import { SPI } from '@/lib/types/spi';
import { Objective } from '@/lib/types/objective';
import { SitRep } from '@/lib/types/sitrep';
import { generateSampleProjects as generateProjects } from '@/lib/services/sampleData/sampleProjectGenerator';
import { generateSampleSPIs, generateSampleObjectives, generateSampleSitReps } from '@/lib/services/sampleData/spiData';
import { toast } from "@/components/ui/use-toast";

export interface GeneratedData {
  projects: Project[];
  spis: SPI[];
  objectives: Objective[];
  sitreps: SitRep[];
}

export interface DataQuantities {
  projects: number;
  spis: number;
  objectives: number;
  sitreps: number;
}

export const sampleFortune30: Collaborator[] = generateFortune30Partners();

export const getSampleInternalPartners = async (): Promise<Collaborator[]> => {
  try {
    const internalPartners = await generateInternalPartners();
    return internalPartners;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error generating internal partners:', errorMessage);
    toast({
      title: "Error",
      description: `Failed to generate internal partners: ${errorMessage}`,
      variant: "destructive",
    });
    throw error;
  }
};

export const generateSampleProjects = async (quantities: DataQuantities): Promise<GeneratedData> => {
  try {
    const fortune30 = sampleFortune30;
    const internalPartners = await generateInternalPartners();
    
    // Validate project quantity with detailed error message
    const maxProjects = Math.min(quantities.projects, 50);
    if (maxProjects !== quantities.projects) {
      toast({
        title: "Notice",
        description: `Project quantity limited to ${maxProjects} (requested: ${quantities.projects})`,
        variant: "default",
      });
    }
    
    // Generate projects with proper error handling
    const result = await generateProjects(fortune30, internalPartners);
    const projects = result.projects.slice(0, maxProjects);
    
    // Generate and validate related data with proper typing
    const spis = generateSampleSPIs(projects.map(p => p.id));
    const objectives = generateSampleObjectives();
    const sitreps = generateSampleSitReps(spis);

    return {
      projects,
      spis: spis.slice(0, quantities.spis),
      objectives: objectives.slice(0, quantities.objectives),
      sitreps: sitreps.slice(0, quantities.sitreps)
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in sample data generation:', errorMessage);
    toast({
      title: "Error",
      description: `Failed to generate sample data: ${errorMessage}`,
      variant: "destructive",
    });
    throw error;
  }
};