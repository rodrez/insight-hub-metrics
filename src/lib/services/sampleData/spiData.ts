import { SPI } from '@/lib/types/spi';
import { SitRep } from '@/lib/types/sitrep';
import { Objective } from '@/lib/types/objective';
import { format, subDays, addDays } from 'date-fns';

export const generateSampleSPIs = (): SPI[] => {
  const spis: SPI[] = [
    {
      id: 'spi-cloud-1',
      name: "Cloud Migration Initiative",
      deliverable: "Migrate 80% of on-premise systems to cloud",
      details: "Systematic migration of critical systems to AWS infrastructure",
      expectedCompletionDate: addDays(new Date(), 90).toISOString(),
      status: 'on-track',
      sitrepIds: [],
      createdAt: new Date().toISOString(),
      departmentId: 'engineering'
    },
    {
      id: 'spi-ai-1',
      name: "AI Integration Project",
      deliverable: "Implement AI-driven analytics across 3 key products",
      details: "Integration of machine learning models for predictive analytics",
      expectedCompletionDate: addDays(new Date(), 120).toISOString(),
      status: 'on-track',
      sitrepIds: [],
      createdAt: new Date().toISOString(),
      departmentId: 'techlab'
    },
    {
      id: 'spi-security-1',
      name: "Security Enhancement Program",
      deliverable: "Achieve SOC2 Type II Compliance",
      details: "Implementation of security controls and documentation",
      expectedCompletionDate: addDays(new Date(), 180).toISOString(),
      status: 'delayed',
      sitrepIds: [],
      createdAt: new Date().toISOString(),
      departmentId: 'it'
    }
  ];

  return spis;
};

export const generateSampleObjectives = (): Objective[] => {
  return [
    {
      id: 'obj-1',
      initiative: "Cloud-First Infrastructure",
      desiredOutcome: "Reduce infrastructure costs by 40% through cloud adoption",
      spiIds: ['spi-cloud-1']
    },
    {
      id: 'obj-2',
      initiative: "AI-Powered Innovation",
      desiredOutcome: "Launch 3 AI-enhanced products by Q4",
      spiIds: ['spi-ai-1']
    },
    {
      id: 'obj-3',
      initiative: "Enterprise Security",
      desiredOutcome: "Achieve highest security certifications and compliance",
      spiIds: ['spi-security-1']
    }
  ];
};

export const generateSampleSitReps = (spis: SPI[]): SitRep[] => {
  const sitreps: SitRep[] = [];
  
  spis.forEach(spi => {
    // Generate 2-3 sitreps per SPI
    const numSitreps = 2 + Math.floor(Math.random() * 2);
    
    for (let i = 0; i < numSitreps; i++) {
      const date = subDays(new Date(), i * 7).toISOString();
      const isLatest = i === 0;
      
      sitreps.push({
        id: `sitrep-${spi.id}-${i + 1}`,
        title: `${spi.name} Update ${i + 1}`,
        date,
        spiId: spi.id,
        update: isLatest ? 
          "Latest milestone achieved on schedule" : 
          "Continuing implementation according to plan",
        challenges: isLatest ?
          "Resource allocation needs optimization" :
          "Minor technical challenges being addressed",
        nextSteps: "Continue with planned activities and monitor progress",
        status: Math.random() > 0.3 ? 'on-track' : 'at-risk',
        summary: `Progress update for ${spi.name}`,
        departmentId: spi.departmentId
      });
    }
    
    // Update the SPI with sitrep IDs
    spi.sitrepIds = sitreps
      .filter(sitrep => sitrep.spiId === spi.id)
      .map(sitrep => sitrep.id);
  });

  return sitreps;
};