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
      details: "Systematic migration of critical systems to AWS infrastructure with focus on security and performance",
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
      details: "Integration of machine learning models for predictive analytics and automated decision making",
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
      details: "Implementation of security controls and documentation for certification",
      expectedCompletionDate: addDays(new Date(), 180).toISOString(),
      status: 'delayed',
      sitrepIds: [],
      createdAt: new Date().toISOString(),
      departmentId: 'it'
    },
    {
      id: 'spi-quantum-1',
      name: "Quantum Computing Research",
      deliverable: "Develop prototype quantum algorithm for optimization",
      details: "Research and development of quantum algorithms for aerospace applications",
      expectedCompletionDate: addDays(new Date(), 240).toISOString(),
      status: 'on-track',
      sitrepIds: [],
      createdAt: new Date().toISOString(),
      departmentId: 'space'
    },
    {
      id: 'spi-green-1',
      name: "Green Energy Initiative",
      deliverable: "Reduce carbon footprint by 30%",
      details: "Implementation of renewable energy sources and efficiency improvements",
      expectedCompletionDate: addDays(new Date(), 150).toISOString(),
      status: 'on-track',
      sitrepIds: [],
      createdAt: new Date().toISOString(),
      departmentId: 'energy'
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
    },
    {
      id: 'obj-4',
      initiative: "Quantum Technology Leadership",
      desiredOutcome: "Establish leadership in quantum computing applications",
      spiIds: ['spi-quantum-1']
    },
    {
      id: 'obj-5',
      initiative: "Sustainable Operations",
      desiredOutcome: "Become carbon neutral by 2025",
      spiIds: ['spi-green-1']
    }
  ];
};

const generateSitRepContent = (spi: SPI, index: number, isLatest: boolean) => {
  const statusMap = {
    'on-track': {
      update: "Implementation progressing according to schedule",
      challenges: "Minor resource allocation adjustments needed",
      nextSteps: "Continue with planned milestones and weekly reviews"
    },
    'delayed': {
      update: "Experiencing some delays in key deliverables",
      challenges: "Resource constraints and technical complexity",
      nextSteps: "Implementing mitigation plan and reallocating resources"
    }
  };

  const content = statusMap[spi.status === 'delayed' ? 'delayed' : 'on-track'];

  return {
    update: isLatest ? `Latest milestone: ${content.update}` : content.update,
    challenges: isLatest ? `Current challenges: ${content.challenges}` : content.challenges,
    nextSteps: isLatest ? `Immediate actions: ${content.nextSteps}` : content.nextSteps,
    status: Math.random() > 0.7 ? 'at-risk' : 'on-track' as 'on-track' | 'at-risk'
  };
};

export const generateSampleSitReps = (spis: SPI[]): SitRep[] => {
  const sitreps: SitRep[] = [];
  
  spis.forEach(spi => {
    // Generate 3-4 sitreps per SPI
    const numSitreps = 3 + Math.floor(Math.random() * 2);
    
    for (let i = 0; i < numSitreps; i++) {
      const date = subDays(new Date(), i * 7).toISOString();
      const isLatest = i === 0;
      const content = generateSitRepContent(spi, i, isLatest);
      
      sitreps.push({
        id: `sitrep-${spi.id}-${i + 1}`,
        title: `${spi.name} Update ${i + 1}`,
        date,
        spiId: spi.id,
        update: content.update,
        challenges: content.challenges,
        nextSteps: content.nextSteps,
        status: content.status,
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