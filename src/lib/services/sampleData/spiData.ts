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
  "AR/VR Research Program",
  "Data Analytics Platform",
  "Cybersecurity Framework"
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
  "Launch AR training platform",
  "Build real-time analytics dashboard",
  "Implement zero-trust architecture"
];

export const generateSampleSPIs = (projectIds: string[] = []): SPI[] => {
  const spis: SPI[] = [];
  const totalSPIs = 12;

  for (let i = 0; i < totalSPIs; i++) {
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
  "Team Velocity Update",
  "Budget Utilization Review",
  "Timeline Adjustment Report"
];

export const generateSampleSitReps = (spis: SPI[]): SitRep[] => {
  const sitreps: SitRep[] = [];
  let sitrepCount = 0;

  spis.forEach(spi => {
    // Generate 2-3 sitreps per SPI
    const numSitreps = 2 + Math.floor(Math.random() * 2);
    
    for (let i = 0; i < numSitreps; i++) {
      const date = subDays(new Date(), i * 7 + Math.floor(Math.random() * 3)).toISOString();
      const status = Math.random() > 0.7 ? 'at-risk' : 'on-track';
      
      sitreps.push({
        id: `sitrep-${++sitrepCount}`,
        title: `${sitrepTitles[Math.floor(Math.random() * sitrepTitles.length)]} - ${spi.name}`,
        date,
        spiId: spi.id,
        projectId: spi.projectId,
        update: `Progress update for ${spi.name}: Implementation phase ${Math.floor(Math.random() * 100)}% complete`,
        challenges: "Resource allocation and technical complexity being addressed",
        nextSteps: "Continue with planned milestones and weekly reviews",
        status,
        summary: `Status report for ${spi.name} implementation progress`,
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

export const generateSampleObjectives = (): Objective[] => {
  return [
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
};