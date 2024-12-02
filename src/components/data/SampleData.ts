import { generateFortune30Partners } from '@/lib/services/data/generators/fortune30Generator';
import { generateInternalPartners } from '@/lib/services/data/generators/internalPartnersGenerator';
import { Project, Collaborator } from '@/lib/types';
import { SPI } from '@/lib/types/spi';
import { Objective } from '@/lib/types/objective';
import { SitRep } from '@/lib/types/sitrep';
import { validateDataQuantities, generateDataWithProgress } from '@/lib/services/data/utils/dataGenerationUtils';
import { generateSampleSPIs, generateSampleObjectives, generateSampleSitReps } from '@/lib/services/data/generators/spiGenerator';
import { toast } from "@/components/ui/use-toast";

export interface DataQuantities {
  projects: number;
  spis: number;
  objectives: number;
  sitreps: number;
  fortune30: number;
  internalPartners: number;
  smePartners: number;
  initiatives: number;
}

export interface GeneratedData {
  projects: Project[];
  spis: SPI[];
  objectives: Objective[];
  sitreps: SitRep[];
}

export const sampleFortune30: Collaborator[] = generateFortune30Partners();

export const getSampleInternalPartners = async (): Promise<Collaborator[]> => {
  return generateDataWithProgress(
    async () => generateInternalPartners(),
    "Internal Partners"
  );
};

const validateProjectReferences = (data: GeneratedData): boolean => {
  const projectIds = new Set(data.projects.map(p => p.id));
  const invalidProjects = data.projects.filter(p => 
    !p.departmentId || !p.poc || !p.techLead
  );

  if (invalidProjects.length > 0) {
    console.error('Invalid projects found:', invalidProjects);
    toast({
      title: "Validation Error",
      description: "Some projects are missing required fields",
      variant: "destructive",
    });
    return false;
  }

  return true;
};

const validateSPIReferences = (data: GeneratedData): boolean => {
  const projectIds = new Set(data.projects.map(p => p.id));
  const invalidSPIs = data.spis.filter(spi => {
    if (!spi.projectId) return false;
    return !projectIds.has(spi.projectId);
  });

  if (invalidSPIs.length > 0) {
    console.error('Invalid SPI references found:', invalidSPIs);
    toast({
      title: "Validation Error",
      description: "Some SPIs reference non-existent projects",
      variant: "destructive",
    });
    return false;
  }

  return true;
};

export const validateDataRelationships = (data: GeneratedData): boolean => {
  console.log('Starting detailed data relationship validation...');
  
  const validations = [
    validateProjectReferences(data),
    validateSPIReferences(data),
  ];

  const isValid = validations.every(result => result === true);
  
  if (isValid) {
    toast({
      title: "Success",
      description: "Data validation passed successfully",
    });
  }

  return isValid;
};

export const generateSampleProjects = async (quantities: DataQuantities): Promise<GeneratedData> => {
  return generateDataWithProgress(async () => {
    console.log('Starting sample project generation with quantities:', quantities);
    
    const fortune30 = sampleFortune30.slice(0, quantities.fortune30);
    const allInternalPartners = await generateInternalPartners();
    const internalPartners = allInternalPartners.slice(0, quantities.internalPartners);
    
    const result = await generateSampleProjects(quantities);
    const projects = result.projects.slice(0, quantities.projects);
    const spis = generateSampleSPIs(projects.map(p => p.id), quantities.spis);
    const objectives = generateSampleObjectives(quantities.objectives);
    const sitreps = generateSampleSitReps(spis, quantities.sitreps);

    const generatedData = {
      projects,
      spis,
      objectives,
      sitreps
    };

    if (!validateDataRelationships(generatedData)) {
      throw new Error("Generated data failed relationship validation");
    }

    return generatedData;
  }, "Sample Projects");
};