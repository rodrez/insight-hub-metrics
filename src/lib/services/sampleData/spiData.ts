import { SPI } from '@/lib/types/spi';
import { SitRep } from '@/lib/types/sitrep';
import { format, subDays, addDays } from 'date-fns';

const spiNames = [
  "Cloud Migration Strategy",
  "AI Integration Framework",
  "Cybersecurity Enhancement",
  "Digital Transformation",
  "Enterprise Data Analytics",
  "Infrastructure Modernization",
  "DevOps Automation Pipeline",
  "System Integration Framework",
  "Cloud Security Architecture",
  "Performance Optimization"
];

const spiDeliverables = [
  "Complete cloud migration roadmap and implementation plan",
  "AI integration framework documentation and pilot results",
  "Enhanced cybersecurity protocols and compliance report",
  "Digital transformation strategy and execution plan",
  "Data analytics platform and insights dashboard",
  "Infrastructure modernization specifications",
  "Automated DevOps pipeline implementation",
  "Cross-platform integration documentation",
  "Cloud security architecture blueprint",
  "Performance optimization metrics and recommendations"
];

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

export const generateSampleObjectives = () => {
  return objectiveTemplates.map((template, index) => ({
    id: `obj-${index + 1}`,
    ...template,
    spiIds: []
  }));
};

const generateOptimalLengthSummary = (topic: string): string => {
  const summaryTemplates = [
    `Comprehensive analysis of ${topic} reveals significant progress in implementation phases. Key stakeholders report positive outcomes across multiple metrics. Team collaboration and technical execution demonstrate strong alignment with strategic objectives. Initial performance indicators suggest successful adoption of new processes and technologies.`,
    `Strategic implementation of ${topic} showcases measurable improvements in system performance. Cross-functional team coordination enables efficient resource utilization. Milestone achievements align with projected timelines and deliverables. Stakeholder feedback indicates strong satisfaction with current progress and direction.`,
    `Detailed evaluation of ${topic} indicates successful completion of critical phases. Stakeholder feedback validates approach effectiveness. Technical implementation meets quality standards and performance expectations. Integration with existing systems proceeds according to plan with minimal disruption to operations.`
  ];
  
  return summaryTemplates[Math.floor(Math.random() * summaryTemplates.length)];
};

export const generateSampleSPIs = (projectIds: string[] = []): SPI[] => {
  if (projectIds.length === 0) {
    console.warn('No project IDs provided for SPI generation');
    return [];
  }

  console.log('Generating SPIs with project IDs:', projectIds);
  const spis: SPI[] = [];

  // Generate one SPI per project, ensuring valid project references
  projectIds.forEach((projectId, index) => {
    if (index >= spiNames.length) return; // Don't exceed available SPI names

    const completionDate = addDays(new Date(), 30 + Math.floor(Math.random() * 180));
    const status = Math.random() > 0.7 ? 'delayed' : 'on-track';
    const isCompleted = Math.random() > 0.8;

    spis.push({
      id: `spi-${index + 1}`,
      name: spiNames[index],
      deliverable: spiDeliverables[index],
      details: `Detailed implementation plan for ${spiNames[index].toLowerCase()}`,
      expectedCompletionDate: completionDate.toISOString(),
      actualCompletionDate: isCompleted ? subDays(completionDate, Math.floor(Math.random() * 30)).toISOString() : undefined,
      status: isCompleted ? 'completed' : status,
      projectId: projectId, // Use the actual project ID
      departmentId: ['engineering', 'techlab', 'it', 'space', 'energy'][Math.floor(Math.random() * 5)],
      sitrepIds: [],
      createdAt: subDays(new Date(), Math.floor(Math.random() * 60)).toISOString()
    });
  });

  console.log('Generated SPIs:', spis.map(spi => ({ id: spi.id, projectId: spi.projectId })));
  return spis;
};

export const generateSampleSitReps = (spis: SPI[]): SitRep[] => {
  if (spis.length === 0) {
    console.warn('No SPIs provided for SitRep generation');
    return [];
  }

  const sitreps: SitRep[] = [];
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

  spis.forEach((spi, index) => {
    if (index >= sitrepTitles.length) return; // Don't exceed available titles

    const date = subDays(new Date(), index * 3).toISOString();
    const title = sitrepTitles[index];
    const summary = generateOptimalLengthSummary(title.split(':')[0]);
    
    const sitrep: SitRep = {
      id: `sitrep-${index + 1}`,
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
  });

  console.log('Generated SitReps:', sitreps.map(sitrep => ({ id: sitrep.id, spiId: sitrep.spiId })));
  return sitreps;
};