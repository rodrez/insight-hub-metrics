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
    "Critical System Migration Update",
    "Cloud Infrastructure Progress Report",
    "Security Implementation Status",
    "Performance Optimization Results",
    "Integration Milestone Review",
    "Resource Allocation Assessment",
    "Technical Debt Resolution Update",
    "Stakeholder Feedback Analysis",
    "Quality Metrics Evaluation",
    "Team Velocity Report"
  ];

  const summaries = [
    "Successfully completed phase 1 of system migration with minimal downtime",
    "Cloud infrastructure deployment progressing ahead of schedule",
    "Security protocols implementation at 75% completion",
    "Performance improvements showing 40% reduction in response time",
    "Integration testing revealed minor issues requiring attention",
    "Resource allocation optimized for Q2 objectives",
    "Technical debt reduced by 30% through targeted refactoring",
    "Positive stakeholder feedback on recent deliverables",
    "Quality metrics showing steady improvement across all KPIs",
    "Team velocity increased by 25% after process improvements"
  ];

  const updates = [
    "Completed database migration and validation",
    "Deployed new cloud services in staging environment",
    "Implemented enhanced security measures",
    "Optimized critical system components",
    "Resolved integration conflicts with legacy systems",
    "Reallocated resources to high-priority tasks",
    "Completed major refactoring initiatives",
    "Incorporated stakeholder feedback into roadmap",
    "Improved test coverage and documentation",
    "Streamlined sprint planning and execution"
  ];

  const challenges = [
    "Legacy system compatibility issues requiring additional testing",
    "Resource constraints impacting deployment timeline",
    "Complex security requirements needing specialized expertise",
    "Performance bottlenecks in specific modules",
    "Integration complexity with third-party systems",
    "Skill gap in emerging technologies",
    "Technical debt in critical components",
    "Stakeholder alignment on priorities",
    "Quality assurance resource limitations",
    "Team coordination across time zones"
  ];

  const nextSteps = [
    "Schedule final migration validation",
    "Prepare production deployment plan",
    "Complete security audit and certification",
    "Implement remaining optimization measures",
    "Finalize integration testing and documentation",
    "Conduct resource planning for next quarter",
    "Continue systematic code improvement",
    "Plan next stakeholder review session",
    "Expand automated testing coverage",
    "Review and adjust team processes"
  ];

  const sitreps: SitRep[] = [];

  for (let i = 0; i < 10; i++) {
    const spi = spis[i % spis.length];
    const date = subDays(new Date(), i * 3).toISOString();
    const status: SitRep['status'] = ['on-track', 'at-risk', 'blocked', 'pending', 'ready'][Math.floor(Math.random() * 5)];
    
    const sitrep: SitRep = {
      id: `sitrep-${i + 1}`,
      title: sitrepTitles[i],
      date,
      spiId: spi.id,
      projectId: spi.projectId,
      update: updates[i],
      challenges: challenges[i],
      nextSteps: nextSteps[i],
      status,
      summary: summaries[i],
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
      title: 'Cloud Infrastructure Modernization',
      description: 'Modernize our infrastructure through cloud adoption and optimization',
      initiative: "Cloud-First Infrastructure",
      desiredOutcome: "Reduce infrastructure costs by 40% through cloud adoption",
      spiIds: ['spi-1']
    },
    {
      id: 'obj-2',
      title: 'AI Product Innovation',
      description: 'Develop and launch AI-enhanced products across our portfolio',
      initiative: "AI-Powered Innovation",
      desiredOutcome: "Launch 3 AI-enhanced products by Q4",
      spiIds: ['spi-2']
    },
    {
      id: 'obj-3',
      title: 'Security Enhancement Program',
      description: 'Strengthen enterprise security posture through certification and compliance',
      initiative: "Enterprise Security",
      desiredOutcome: "Achieve highest security certifications and compliance",
      spiIds: ['spi-3']
    },
    {
      id: 'obj-4',
      title: 'Quantum Computing Research',
      description: 'Research and develop quantum computing applications',
      initiative: "Quantum Technology Leadership",
      desiredOutcome: "Establish leadership in quantum computing applications",
      spiIds: ['spi-4']
    },
    {
      id: 'obj-5',
      title: 'Sustainability Initiative',
      description: 'Implement sustainable operations across the organization',
      initiative: "Sustainable Operations",
      desiredOutcome: "Become carbon neutral by 2025",
      spiIds: ['spi-5']
    }
  ];

  return objectives;
};