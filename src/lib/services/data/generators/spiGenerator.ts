import { SPI } from '@/lib/types/spi';
import { Objective } from '@/lib/types/objective';
import { SitRep } from '@/lib/types/sitrep';
import { Initiative } from '@/lib/types/initiative';
import { addDays } from 'date-fns';

export const generateSampleSPIs = (projectIds: string[], count: number): SPI[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `spi-${i + 1}`,
    name: `Strategic Initiative ${i + 1}`,
    deliverable: `Deliverable for Initiative ${i + 1}`,
    details: `Details for Initiative ${i + 1}`,
    expectedCompletionDate: addDays(new Date(), 30).toISOString(),
    status: 'on-track',
    projectId: projectIds[i % projectIds.length],
    departmentId: 'engineering',
    sitrepIds: [],
    createdAt: new Date().toISOString()
  }));
};

export const generateSampleObjectives = (count: number): Objective[] => {
  const objectives = [
    {
      id: 'obj-1',
      title: "Enhance Digital Infrastructure",
      description: "Strengthen and modernize our digital foundation",
      desiredOutcome: "Robust, scalable infrastructure supporting future growth",
      spiIds: []
    },
    {
      id: 'obj-2',
      title: "Improve Customer Experience",
      description: "Transform customer interactions across all touchpoints",
      desiredOutcome: "Increased customer satisfaction and loyalty",
      spiIds: []
    },
    {
      id: 'obj-3',
      title: "Optimize Operational Efficiency",
      description: "Streamline internal processes and workflows",
      desiredOutcome: "Reduced operational costs and improved productivity",
      spiIds: []
    }
  ];
  return objectives;
};

export const generateSampleInitiatives = (): Initiative[] => {
  return [
    {
      id: 'init-1',
      title: "Cloud Migration",
      description: "Migrate core systems to cloud infrastructure",
      details: "Complete migration of legacy systems to cloud platforms",
      desiredOutcome: "99.9% system availability and 30% cost reduction",
      objectiveId: 'obj-1',
      createdAt: new Date().toISOString()
    },
    {
      id: 'init-2',
      title: "Security Enhancement",
      description: "Implement zero-trust security model",
      details: "Deploy advanced security measures across infrastructure",
      desiredOutcome: "Zero critical security incidents",
      objectiveId: 'obj-1',
      createdAt: new Date().toISOString()
    },
    {
      id: 'init-3',
      title: "API Modernization",
      description: "Modernize API infrastructure",
      details: "Implement RESTful APIs with proper documentation",
      desiredOutcome: "50% reduction in API-related issues",
      objectiveId: 'obj-1',
      createdAt: new Date().toISOString()
    },
    {
      id: 'init-4',
      title: "Mobile App Redesign",
      description: "Redesign mobile application UI/UX",
      details: "Create intuitive mobile experience",
      desiredOutcome: "40% increase in mobile app usage",
      objectiveId: 'obj-2',
      createdAt: new Date().toISOString()
    },
    {
      id: 'init-5',
      title: "Customer Support Portal",
      description: "Develop self-service support portal",
      details: "Implement AI-powered support system",
      desiredOutcome: "30% reduction in support tickets",
      objectiveId: 'obj-2',
      createdAt: new Date().toISOString()
    },
    {
      id: 'init-6',
      title: "Feedback System",
      description: "Implement real-time feedback system",
      details: "Deploy customer feedback collection and analysis",
      desiredOutcome: "25% increase in customer feedback collection",
      objectiveId: 'obj-2',
      createdAt: new Date().toISOString()
    },
    {
      id: 'init-7',
      title: "Process Automation",
      description: "Automate manual workflows",
      details: "Implement RPA for routine tasks",
      desiredOutcome: "60% reduction in manual processing time",
      objectiveId: 'obj-3',
      createdAt: new Date().toISOString()
    },
    {
      id: 'init-8',
      title: "Data Analytics Platform",
      description: "Deploy advanced analytics platform",
      details: "Implement real-time business intelligence",
      desiredOutcome: "20% improvement in decision-making speed",
      objectiveId: 'obj-3',
      createdAt: new Date().toISOString()
    },
    {
      id: 'init-9',
      title: "Resource Optimization",
      description: "Optimize resource allocation",
      details: "Implement AI-driven resource management",
      desiredOutcome: "25% improvement in resource utilization",
      objectiveId: 'obj-3',
      createdAt: new Date().toISOString()
    },
    {
      id: 'init-10',
      title: "DevOps Implementation",
      description: "Establish DevOps practices",
      details: "Implement CI/CD pipelines",
      desiredOutcome: "50% faster deployment cycles",
      objectiveId: 'obj-1',
      createdAt: new Date().toISOString()
    },
    {
      id: 'init-11',
      title: "Knowledge Base",
      description: "Create centralized knowledge repository",
      details: "Implement searchable documentation system",
      desiredOutcome: "40% reduction in information retrieval time",
      objectiveId: 'obj-2',
      createdAt: new Date().toISOString()
    },
    {
      id: 'init-12',
      title: "Monitoring System",
      description: "Implement comprehensive monitoring",
      details: "Deploy system-wide monitoring and alerts",
      desiredOutcome: "90% early issue detection rate",
      objectiveId: 'obj-3',
      createdAt: new Date().toISOString()
    }
  ];
};

export const generateSampleSitReps = (spis: SPI[], count: number): SitRep[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `sitrep-${i + 1}`,
    title: `SitRep ${i + 1}`,
    date: new Date().toISOString(),
    spiId: spis[i % spis.length].id,
    update: `Update for SitRep ${i + 1}`,
    challenges: `Challenges for SitRep ${i + 1}`,
    nextSteps: `Next steps for SitRep ${i + 1}`,
    status: 'pending-review',
    summary: `Summary for SitRep ${i + 1}`,
    departmentId: 'engineering'
  }));
};
