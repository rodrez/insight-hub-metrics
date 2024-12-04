import { DEPARTMENTS } from '@/lib/constants';
import { defaultTechDomains } from '@/lib/types/techDomain';
import { generateProjectData } from './projectDataGenerator';
import { Collaborator } from '@/lib/types/collaboration';
import { generateSampleSPIs, generateSampleObjectives, generateSampleSitReps } from '../sampleData/spiData';
import { DataQuantities } from '@/lib/types/data';
import { toast } from "@/components/ui/use-toast";

export const generateSampleData = async (internalPartners: Collaborator[], quantities: DataQuantities) => {
  try {
    console.log('Generating sample data with quantities:', quantities);
    
    const departments = [...DEPARTMENTS];
    
    // Generate exactly the requested number of projects
    const { projects } = generateProjectData(departments, defaultTechDomains, internalPartners, quantities.projects);
    console.log(`Generated ${projects.length} projects`);
    
    if (projects.length < quantities.projects) {
      toast({
        title: "Warning",
        description: `Could only generate ${projects.length} projects due to available partner constraints`,
        variant: "destructive",
      });
    }
    
    // Generate SPIs with exact count
    const spis = generateSampleSPIs(
      projects.map(p => p.id),
      quantities.spis
    );
    console.log(`Generated ${spis.length} SPIs`);
    
    // Generate objectives with exact count
    const objectives = generateSampleObjectives(quantities.objectives);
    console.log(`Generated ${objectives.length} objectives`);
    
    // Generate sitreps with exact count
    const sitreps = generateSampleSitReps(spis, quantities.sitreps);
    console.log(`Generated ${sitreps.length} sitreps`);
    
    return { 
      projects, 
      internalPartners,
      spis,
      objectives,
      sitreps
    };
  } catch (error) {
    console.error('Error generating sample data:', error);
    throw error;
  }
};