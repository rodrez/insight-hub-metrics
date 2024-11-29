import { SPI } from '@/lib/types/spi';
import { SitRep } from '@/lib/types/sitrep';
import { format, subDays, addDays } from 'date-fns';

const sitrepTitles = [
  "2024 Cloud Migration Strategy: Key Milestones and Implementation Timeline",
  "AI Integration Framework: Best Practices and Performance Metrics",
  "Cybersecurity Enhancement Program: Q1 2024 Progress Report",
  "Digital Transformation Roadmap: Technical Architecture and Solutions",
  "Enterprise Data Analytics: Implementation Strategy and Results",
  "Infrastructure Modernization: Phase 1 Deployment Analysis",
  "DevOps Automation Pipeline: Efficiency Metrics and Improvements",
  "System Integration Framework: Cross-Platform Solutions Overview",
  "Cloud Security Architecture: Implementation and Compliance Update",
  "Performance Optimization Initiative: Technical Deep Dive and Metrics"
];

const generateOptimalLengthSummary = (topic: string): string => {
  const summaryTemplates = [
    `Comprehensive analysis of ${topic} reveals significant progress in implementation phases. Key stakeholders report positive outcomes across multiple metrics. Team collaboration and technical execution demonstrate strong alignment with strategic objectives.`,
    `Strategic implementation of ${topic} showcases measurable improvements in system performance. Cross-functional team coordination enables efficient resource utilization. Milestone achievements align with projected timelines and deliverables.`,
    `Detailed evaluation of ${topic} indicates successful completion of critical phases. Stakeholder feedback validates approach effectiveness. Technical implementation meets quality standards and performance expectations.`
  ];
  
  return summaryTemplates[Math.floor(Math.random() * summaryTemplates.length)];
};

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
  const sitreps: SitRep[] = [];

  for (let i = 0; i < 10; i++) {
    const spi = spis[i % spis.length];
    const date = subDays(new Date(), i * 3).toISOString();
    const title = sitrepTitles[i];
    const summary = generateOptimalLengthSummary(title.split(':')[0]);
    
    const sitrep: SitRep = {
      id: `sitrep-${i + 1}`,
      title,
      date,
      spiId: spi.id,
      projectId: spi.projectId,
      update: `Detailed progress update for ${title.split(':')[0]}`,
      challenges: "Currently addressing resource allocation and technical complexity challenges",
      nextSteps: "Proceeding with planned milestone implementation and scheduled reviews",
      status: 'pending-review',
      summary,
      departmentId: spi.departmentId
    };
    
    sitreps.push(sitrep);
  }

  return sitreps;
};
