import { generateFortune30Partners } from '@/lib/services/data/generators/fortune30Generator';
import { generateInternalPartners } from '@/lib/services/data/generators/internalPartnersGenerator';
import { Project, Collaborator } from '@/lib/types';
import { SPI } from '@/lib/types/spi';
import { Objective } from '@/lib/types/objective';
import { SitRep } from '@/lib/types/sitrep';
import { validateDataQuantities, generateDataWithProgress } from '@/lib/services/data/utils/dataGenerationUtils';
import { generateSampleSPIs, generateSampleObjectives, generateSampleSitReps } from '@/lib/services/data/generators/spiGenerator';

export interface DataQuantities {
  projects: number;
  spis: number;
  objectives: number;
  sitreps: number;
  fortune30: number;
  internalPartners: number;
  smePartners: number;
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

export const validateDataRelationships = (data: GeneratedData): boolean => {
  console.log('Starting detailed data relationship validation...');
  console.log('Projects count:', data.projects.length);
  console.log('SPIs count:', data.spis.length);
  console.log('Objectives count:', data.objectives.length);
  console.log('SitReps count:', data.sitreps.length);
  
  const projectIds = new Set(data.projects.map(p => p.id));
  const spiIds = new Set(data.spis.map(s => s.id));
  
  console.log('\nValidating Project-SPI relationships...');
  const invalidSPIs = data.spis.filter(spi => {
    if (!spi.projectId) return false; // Skip if projectId is undefined (valid case)
    const hasValidProject = projectIds.has(spi.projectId);
    if (!hasValidProject) {
      console.error(`SPI ${spi.id} references non-existent project: ${spi.projectId}`);
      console.log('Available project IDs:', Array.from(projectIds));
    }
    return !hasValidProject;
  });

  console.log('\nValidating SPI-SitRep relationships...');
  const invalidSitReps = data.sitreps.filter(sitrep => {
    const hasValidSPI = spiIds.has(sitrep.spiId);
    if (!hasValidSPI) {
      console.error(`SitRep ${sitrep.id} references non-existent SPI: ${sitrep.spiId}`);
      console.log('Available SPI IDs:', Array.from(spiIds));
    }
    return !hasValidSPI;
  });

  console.log('\nValidating objectives...');
  const invalidObjectives = data.objectives.filter(objective => {
    const isValid = objective.id && objective.initiative && objective.desiredOutcome;
    if (!isValid) {
      console.error('Invalid objective found:', objective);
    }
    return !isValid;
  });

  const validationResults = {
    validSPIs: invalidSPIs.length === 0,
    validSitReps: invalidSitReps.length === 0,
    validObjectives: invalidObjectives.length === 0
  };

  console.log('\nValidation Results:', validationResults);
  console.log('Invalid SPIs count:', invalidSPIs.length);
  console.log('Invalid SitReps count:', invalidSitReps.length);
  console.log('Invalid Objectives count:', invalidObjectives.length);

  const isValid = Object.values(validationResults).every(result => result === true);
  
  if (!isValid) {
    console.error('\nValidation failed. Sample data dump:');
    console.log('First project:', data.projects[0]);
    console.log('First SPI:', data.spis[0]);
    console.log('First objective:', data.objectives[0]);
    console.log('First sitRep:', data.sitreps[0]);
  }

  return isValid;
};

export const generateSampleProjects = async (quantities: DataQuantities): Promise<GeneratedData> => {
  return generateDataWithProgress(async () => {
    console.log('Starting sample project generation with quantities:', quantities);
    
    const fortune30 = sampleFortune30.slice(0, quantities.fortune30);
    console.log('Generated Fortune 30 partners:', fortune30.length);
    
    const allInternalPartners = await generateInternalPartners();
    const internalPartners = allInternalPartners.slice(0, quantities.internalPartners);
    console.log('Generated internal partners:', internalPartners.length);
    
    const result = await generateSampleProjects(quantities);
    const projects = result.projects.slice(0, quantities.projects);
    console.log('Generated and filtered projects:', projects.length);
    
    const spis = generateSampleSPIs(projects.map(p => p.id), quantities.spis);
    console.log('Generated and filtered SPIs:', spis.length);
    
    const objectives = generateSampleObjectives(quantities.objectives);
    console.log('Generated and filtered objectives:', objectives.length);
    
    const sitreps = generateSampleSitReps(spis, quantities.sitreps);
    console.log('Generated and filtered sitreps:', sitreps.length);

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
