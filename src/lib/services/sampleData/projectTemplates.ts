import { Project } from '@/lib/types';

export const projectNames = [
  "Next-Gen AI Integration",
  "Sustainable Aviation",
  "Cloud Infrastructure Upgrade",
  "Quantum Computing Research",
  "Green Energy Initiative",
  "Digital Transformation",
  "Smart Manufacturing",
  "Autonomous Systems",
  "Data Analytics Platform",
  "Cybersecurity Enhancement"
];

export const generateNABC = (deptName: string, projectName: string) => ({
  needs: `Addressing critical business needs in ${deptName.toLowerCase()} through ${projectName.toLowerCase()} implementation.`,
  approach: "Implementing cutting-edge technologies and innovative solutions, combined with AI-driven optimization algorithms for maximum performance.",
  benefits: "20% reduction in operational costs, 15% decrease in maintenance costs, and potential market leadership in eco-friendly solutions.",
  competition: "Major competitors are investing in similar technologies, but our integrated approach provides a significant advantage in time-to-market."
});

export const generateMilestones = (projectId: string) => [
  {
    id: `${projectId}-m1`,
    title: "Requirements & Planning",
    description: "Define technical specifications and project scope",
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    status: "completed" as const,
    progress: 100
  },
  {
    id: `${projectId}-m2`,
    title: "Design Phase",
    description: "Complete system architecture and detailed design",
    dueDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
    status: "in-progress" as const,
    progress: 65
  },
  {
    id: `${projectId}-m3`,
    title: "Implementation",
    description: "Development and integration of core systems",
    dueDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
    status: "pending" as const,
    progress: 0
  }
];

export const generateMetrics = (projectId: string, spent: number, budget: number) => [
  {
    id: `${projectId}-metric-1`,
    name: "Development Progress",
    value: Math.round(Math.random() * 100),
    target: 100,
    unit: "%",
    trend: "up" as const,
    description: "Overall project completion status"
  },
  {
    id: `${projectId}-metric-2`,
    name: "Budget Utilization",
    value: Math.round((spent / budget) * 100),
    target: 100,
    unit: "%",
    trend: "stable" as const,
    description: "Current budget consumption vs allocation"
  },
  {
    id: `${projectId}-metric-3`,
    name: "Resource Efficiency",
    value: Math.round(Math.random() * 90 + 10),
    target: 95,
    unit: "%",
    trend: "up" as const,
    description: "Team productivity and resource utilization"
  }
];