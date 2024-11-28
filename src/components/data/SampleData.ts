import { generateFortune30Partners } from '@/lib/services/data/fortune30Partners';
import { generateInternalPartners } from '@/lib/services/data/internalPartners';
import { Project, Collaborator } from '@/lib/types';
import { SPI } from '@/lib/types/spi';
import { Objective } from '@/lib/types/objective';
import { SitRep } from '@/lib/types/sitrep';
import { generateSampleProjects as generateProjects } from '@/lib/services/sampleData/sampleProjectGenerator';
import { generateSampleSPIs, generateSampleObjectives, generateSampleSitReps } from '@/lib/services/sampleData/spiData';
import { validateDataQuantities, generateDataWithProgress } from '@/lib/services/data/utils/dataGenerationUtils';

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
  return generateDataWithProgress(
    async () => generateInternalPartners(),
    "Internal Partners"
  );
};

export const validateDataRelationships = (data: GeneratedData): boolean => {
  // Validate project-SPI relationships
  const validSPIs = data.spis.every(spi => 
    data.projects.some(project => project.id === spi.projectId)
  );

  // Validate SPI-SitRep relationships
  const validSitReps = data.sitreps.every(sitrep => 
    data.spis.some(spi => spi.id === sitrep.spiId)
  );

  // Validate objectives consistency
  const validObjectives = data.objectives.every(objective => 
    objective.id && objective.title && objective.description
  );

  return validSPIs && validSitReps && validObjectives;
};

export const generateSampleProjects = async (quantities: DataQuantities): Promise<GeneratedData> => {
  return generateDataWithProgress(async () => {
    const fortune30 = sampleFortune30;
    const internalPartners = await generateInternalPartners();
    
    const maxProjects = validateDataQuantities(quantities.projects, 50, "Projects");
    
    const result = await generateProjects(fortune30, internalPartners);
    const projects = result.projects.slice(0, maxProjects);
    
    const spis = generateSampleSPIs(projects.map(p => p.id));
    const objectives = generateSampleObjectives();
    const sitreps = generateSampleSitReps(spis);

    const generatedData = {
      projects,
      spis: spis.slice(0, quantities.spis),
      objectives: objectives.slice(0, quantities.objectives),
      sitreps: sitreps.slice(0, quantities.sitreps)
    };

    // Validate data relationships before returning
    if (!validateDataRelationships(generatedData)) {
      throw new Error("Generated data failed relationship validation");
    }

    return generatedData;
  }, "Sample Projects");
};