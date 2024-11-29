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
  console.log('Starting detailed data relationship validation...');
  console.log('Projects count:', data.projects.length);
  console.log('SPIs count:', data.spis.length);
  console.log('Objectives count:', data.objectives.length);
  console.log('SitReps count:', data.sitreps.length);
  
  // Validate project-SPI relationships
  console.log('\nValidating Project-SPI relationships...');
  const invalidSPIs = data.spis.filter(spi => {
    const hasValidProject = data.projects.some(project => project.id === spi.projectId);
    if (!hasValidProject) {
      console.error(`SPI ${spi.id} references non-existent project: ${spi.projectId}`);
      console.log('Available project IDs:', data.projects.map(p => p.id));
    }
    return !hasValidProject;
  });

  // Validate SPI-SitRep relationships
  console.log('\nValidating SPI-SitRep relationships...');
  const invalidSitReps = data.sitreps.filter(sitrep => {
    const hasValidSPI = data.spis.some(spi => spi.id === sitrep.spiId);
    if (!hasValidSPI) {
      console.error(`SitRep ${sitrep.id} references non-existent SPI: ${sitrep.spiId}`);
      console.log('Available SPI IDs:', data.spis.map(s => s.id));
    }
    return !hasValidSPI;
  });

  // Validate objectives consistency
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
    
    const fortune30 = sampleFortune30;
    console.log('Generated Fortune 30 partners:', fortune30.length);
    
    const internalPartners = await generateInternalPartners();
    console.log('Generated internal partners:', internalPartners.length);
    
    const maxProjects = validateDataQuantities(quantities.projects, 50, "Projects");
    console.log('Validated max projects:', maxProjects);
    
    const result = await generateProjects(fortune30, internalPartners);
    console.log('Generated projects:', result.projects.length);
    
    const projects = result.projects.slice(0, maxProjects);
    console.log('Filtered projects to:', projects.length);
    
    const spis = generateSampleSPIs(projects.map(p => p.id));
    console.log('Generated SPIs:', spis.length);
    
    const objectives = generateSampleObjectives();
    console.log('Generated objectives:', objectives.length);
    
    const sitreps = generateSampleSitReps(spis);
    console.log('Generated sitreps:', sitreps.length);

    const generatedData = {
      projects,
      spis: spis.slice(0, quantities.spis),
      objectives: objectives.slice(0, quantities.objectives),
      sitreps: sitreps.slice(0, quantities.sitreps)
    };

    console.log('Final data quantities:', {
      projects: generatedData.projects.length,
      spis: generatedData.spis.length,
      objectives: generatedData.objectives.length,
      sitreps: generatedData.sitreps.length
    });

    // Validate data relationships before returning
    if (!validateDataRelationships(generatedData)) {
      console.error('Data validation failed. Dumping first few records of each type for debugging:');
      console.log('Sample Projects:', generatedData.projects.slice(0, 2));
      console.log('Sample SPIs:', generatedData.spis.slice(0, 2));
      console.log('Sample Objectives:', generatedData.objectives.slice(0, 2));
      console.log('Sample SitReps:', generatedData.sitreps.slice(0, 2));
      throw new Error("Generated data failed relationship validation");
    }

    return generatedData;
  }, "Sample Projects");
};