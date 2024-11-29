import { SPI } from '@/lib/types/spi';
import { SitRep } from '@/lib/types/sitrep';
import { format, subDays, addDays } from 'date-fns';

const generateSPIName = (index: number): string => {
  const baseNames = [
    "Cloud Migration",
    "AI Integration",
    "Cybersecurity",
    "Digital Transformation",
    "Data Analytics"
  ];
  
  const suffixes = [
    "Strategy",
    "Framework",
    "Enhancement",
    "Initiative",
    "Platform"
  ];
  
  const baseName = baseNames[index % baseNames.length];
  const suffix = suffixes[Math.floor(index / baseNames.length)];
  return `${baseName} ${suffix} ${Math.floor(index / (baseNames.length * suffixes.length)) + 1}`;
};

const generateDeliverable = (name: string): string => {
  return `Complete ${name.toLowerCase()} documentation and implementation plan`;
};

const objectiveTemplates = [
  {
    title: "Enhance System Performance",
    description: "Improve overall system performance and response times",
    initiative: "Technical Excellence",
    desiredOutcome: "20% reduction in response times"
  },
  {
    title: "Optimize Resource Utilization",
    description: "Maximize efficiency of cloud resources",
    initiative: "Cost Optimization",
    desiredOutcome: "15% reduction in cloud costs"
  },
  {
    title: "Strengthen Security Measures",
    description: "Implement advanced security protocols",
    initiative: "Security Enhancement",
    desiredOutcome: "Zero security incidents"
  }
];

export const generateSampleObjectives = (count: number = 5) => {
  const objectives = [];
  for (let i = 0; i < count; i++) {
    const template = objectiveTemplates[i % objectiveTemplates.length];
    objectives.push({
      id: `obj-${i + 1}`,
      ...template,
      title: `${template.title} ${Math.floor(i / objectiveTemplates.length) + 1}`,
      spiIds: []
    });
  }
  return objectives;
};

export const generateSampleSPIs = (projectIds: string[], requestedCount: number): SPI[] => {
  if (projectIds.length === 0) {
    console.warn('No project IDs provided for SPI generation');
    return [];
  }

  const spis: SPI[] = [];

  for (let i = 0; i < requestedCount; i++) {
    const projectId = projectIds[i % projectIds.length];
    const name = generateSPIName(i);
    const completionDate = addDays(new Date(), 30 + Math.floor(Math.random() * 180));
    const status = Math.random() > 0.7 ? 'delayed' : 'on-track';
    const isCompleted = Math.random() > 0.8;

    spis.push({
      id: `spi-${i + 1}`,
      name,
      deliverable: generateDeliverable(name),
      details: `Detailed implementation plan for ${name.toLowerCase()}`,
      expectedCompletionDate: completionDate.toISOString(),
      actualCompletionDate: isCompleted ? subDays(completionDate, Math.floor(Math.random() * 30)).toISOString() : undefined,
      status: isCompleted ? 'completed' : status,
      projectId,
      departmentId: ['engineering', 'techlab', 'it', 'space', 'energy'][Math.floor(Math.random() * 5)],
      sitrepIds: [],
      createdAt: subDays(new Date(), Math.floor(Math.random() * 60)).toISOString()
    });
  }

  return spis;
};

export const generateSampleSitReps = (spis: SPI[], requestedCount: number): SitRep[] => {
  const sitreps: SitRep[] = [];

  for (let i = 0; i < requestedCount; i++) {
    if (spis.length === 0) {
      sitreps.push({
        id: `sitrep-${i + 1}`,
        title: `Sample SitRep ${i + 1}`,
        date: new Date().toISOString(),
        spiId: 'sample-spi',
        update: 'Initial project update',
        challenges: 'No major challenges identified',
        nextSteps: 'Continue with planned implementation',
        status: 'pending-review',
        summary: 'This is a sample situation report to demonstrate the functionality.',
        departmentId: 'engineering',
        level: ['CEO', 'SVP', 'CTO'][Math.floor(Math.random() * 3)] as 'CEO' | 'SVP' | 'CTO',
        teams: ['Engineering', 'Product', 'Design'].slice(0, Math.floor(Math.random() * 3) + 1)
      });
      continue;
    }

    const spi = spis[i % spis.length];
    const date = subDays(new Date(), i * 3).toISOString();
    const title = `${spi.name}: Progress Report ${i + 1}`;
    
    sitreps.push({
      id: `sitrep-${i + 1}`,
      title,
      date,
      spiId: spi.id,
      projectId: spi.projectId,
      update: `Detailed progress update for ${spi.name}. Team has made substantial progress on key deliverables.`,
      challenges: "Currently addressing resource allocation and technical complexity challenges.",
      nextSteps: "Proceeding with planned milestone implementation and scheduled reviews.",
      status: ['pending-review', 'ready', 'submitted'][Math.floor(Math.random() * 3)] as 'pending-review' | 'ready' | 'submitted',
      summary: `Progress update for ${spi.name} showing significant advancement in implementation phases.`,
      departmentId: spi.departmentId,
      level: ['CEO', 'SVP', 'CTO'][Math.floor(Math.random() * 3)] as 'CEO' | 'SVP' | 'CTO',
      teams: ['Engineering', 'Product', 'Design'].slice(0, Math.floor(Math.random() * 3) + 1)
    });
  }

  return sitreps;
};