import { generateFortune30Partners } from '@/lib/services/data/fortune30Partners';
import { generateInternalPartners } from '@/lib/services/data/internalPartners';
import { Project } from '@/lib/types';
import { generateSampleProjects as generateProjects } from '@/lib/services/sampleData/sampleProjectGenerator';
import { generateSampleSPIs, generateSampleObjectives, generateSampleSitReps } from '@/lib/services/sampleData/spiData';
import { toast } from "@/components/ui/use-toast";

export const sampleFortune30 = generateFortune30Partners();

export const getSampleInternalPartners = async () => {
  try {
    const internalPartners = await generateInternalPartners();
    return internalPartners;
  } catch (error) {
    console.error('Error generating internal partners:', error);
    toast({
      title: "Error",
      description: "Failed to generate internal partners",
      variant: "destructive",
    });
    throw error;
  }
};

export const generateSampleProjects = async (quantities: {
  projects: number;
  spis: number;
  objectives: number;
  sitreps: number;
}): Promise<{
  projects: Project[];
  spis: any[];
  objectives: any[];
  sitreps: any[];
}> => {
  try {
    const fortune30 = sampleFortune30;
    const internalPartners = await generateInternalPartners();
    
    // Validate project quantity
    const maxProjects = Math.min(quantities.projects, 50); // Set a reasonable limit
    
    // Generate projects
    const result = await generateProjects(fortune30, internalPartners);
    const projects = result.projects.slice(0, maxProjects);
    
    if (projects.length < quantities.projects) {
      toast({
        title: "Warning",
        description: `Only ${projects.length} projects could be generated (requested: ${quantities.projects})`,
        variant: "warning",
      });
    }
    
    // Generate and validate related data
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
    console.error('Error in sample data generation:', error);
    toast({
      title: "Error",
      description: "Failed to generate sample data",
      variant: "destructive",
    });
    throw error;
  }
};