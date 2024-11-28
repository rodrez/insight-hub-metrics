import { SPI } from '@/lib/types/spi';
import { SitRep } from '@/lib/types/sitrep';
import { Objective } from '@/lib/types/objective';
import { format, subDays, addDays } from 'date-fns';

const spiNames = [
  "Cloud Migration Initiative",
  "AI Integration Project",
  "Security Enhancement Program",
  "Quantum Computing Research",
  "Green Energy Initiative",
  "Digital Transformation",
  "IoT Platform Development",
  "Blockchain Integration",
  "5G Network Deployment",
  "Data Analytics Platform"
];

const spiDeliverables = [
  "Migrate 80% of on-premise systems to cloud",
  "Implement AI-driven analytics across products",
  "Achieve SOC2 Type II Compliance",
  "Develop quantum algorithm prototype",
  "Reduce carbon footprint by 30%",
  "Digitize 90% of manual processes",
  "Deploy IoT sensors across facilities",
  "Implement smart contracts system",
  "Complete 5G infrastructure setup",
  "Build real-time analytics dashboard"
];

export const generateSampleSPIs = (projectIds: string[] = []): SPI[] => {
  const spis: SPI[] = [];

  for (let i = 0; i < spiNames.length; i++) {
    const isProjectLinked = i < projectIds.length;
    const completionDate = addDays(new Date(), 30 + Math.floor(Math.random() * 180));
    const status = Math.random() > 0.7 ? 'delayed' : 'on-track';
    const isCompleted = Math.random() > 0.8;

    spis.push({
      id: `spi-${i + 1}`,
      name: spiNames[i],
      deliverable: spiDeliverables[i],
      details: `Detailed implementation plan for ${spiNames[i].toLowerCase()}`,
      expectedCompletionDate: completionDate.toISOString(),
      actualCompletionDate: isCompleted ? subDays(completionDate, Math.floor(Math.random() * 30)).toISOString() : undefined,
      status: isCompleted ? 'completed' : status,
      projectId: isProjectLinked ? projectIds[i] : undefined,
      departmentId: ['engineering', 'techlab', 'it', 'space', 'energy'][Math.floor(Math.random() * 5)],
      sitrepIds: [],
      createdAt: subDays(new Date(), Math.floor(Math.random() * 60)).toISOString()
    });
  }

  return spis;
};

export const generateSampleSitReps = (spis: SPI[]): SitRep[] => {
  const sitrepTitles = [
    "Weekly Progress Update",
    "Technical Implementation Status",
    "Resource Allocation Review",
    "Risk Assessment Report",
    "Milestone Achievement Report",
    "Integration Status Update",
    "Performance Metrics Review",
    "Stakeholder Feedback Summary",
    "Quality Assurance Report",
    "Team Velocity Update"
  ];

  const sitreps: SitRep[] = [];

  for (let i = 0; i < sitrepTitles.length; i++) {
    const spi = spis[i % spis.length];
    const date = subDays(new Date(), i * 7).toISOString();
    const status: SitRep['status'] = Math.random() > 0.7 ? 'at-risk' : 'on-track';
    
    const sitrep: SitRep = {
      id: `sitrep-${i + 1}`,
      title: sitrepTitles[i],
      date,
      spiId: spi.id,
      projectId: spi.projectId,
      update: `Progress update for ${spi.name}: Implementation phase ${Math.floor(Math.random() * 100)}% complete`,
      challenges: "Resource allocation and technical complexity being addressed",
      nextSteps: "Continue with planned milestones and weekly reviews",
      status,
      summary: `Status report for ${spi.name} implementation progress`,
      departmentId: spi.departmentId
    };
    
    sitreps.push(sitrep);
    
    // Update the SPI with sitrep ID
    spi.sitrepIds.push(sitrep.id);
  }

  return sitreps;
};

export const generateSampleObjectives = (): Objective[] => {
  const objectives: Objective[] = [
    {
      id: 'obj-1',
      initiative: "Cloud-First Infrastructure",
      desiredOutcome: "Reduce infrastructure costs by 40% through cloud adoption",
      spiIds: ['spi-1']
    },
    {
      id: 'obj-2',
      initiative: "AI-Powered Innovation",
      desiredOutcome: "Launch 3 AI-enhanced products by Q4",
      spiIds: ['spi-2']
    },
    {
      id: 'obj-3',
      initiative: "Enterprise Security",
      desiredOutcome: "Achieve highest security certifications and compliance",
      spiIds: ['spi-3']
    },
    {
      id: 'obj-4',
      initiative: "Quantum Technology Leadership",
      desiredOutcome: "Establish leadership in quantum computing applications",
      spiIds: ['spi-4']
    },
    {
      id: 'obj-5',
      initiative: "Sustainable Operations",
      desiredOutcome: "Become carbon neutral by 2025",
      spiIds: ['spi-5']
    }
  ];

  return objectives;
};