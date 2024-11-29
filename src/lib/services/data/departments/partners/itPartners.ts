import { Collaborator } from "@/lib/types/collaboration";

export const generateITPartners = (): Collaborator[] => [
  {
    id: "it-1",
    name: "James Wilson",
    email: "j.wilson@company.com",
    role: "IT Systems Engineer",
    department: "it",
    projects: [
      {
        id: "it-project-1",
        name: "Cloud Infrastructure",
        description: "Enterprise cloud infrastructure upgrade",
        status: "active"
      }
    ],
    lastActive: new Date().toISOString(),
    type: "other"
  },
  {
    id: "it-2",
    name: "Maria Rodriguez",
    email: "m.rodriguez@company.com",
    role: "Systems Analyst",
    department: "it",
    projects: [
      {
        id: "it-project-2",
        name: "Digital Transformation",
        description: "Enterprise-wide digital transformation",
        status: "active"
      }
    ],
    lastActive: new Date().toISOString(),
    type: "other"
  },
  {
    id: "it-3",
    name: "William Taylor",
    email: "w.taylor@company.com",
    role: "Network Architect",
    department: "it",
    projects: [
      {
        id: "it-project-1",
        name: "Cloud Infrastructure",
        description: "Enterprise cloud infrastructure upgrade",
        status: "active"
      }
    ],
    lastActive: new Date().toISOString(),
    type: "other"
  },
  {
    id: "it-4",
    name: "Sophie Turner",
    email: "s.turner@company.com",
    role: "Information Security Analyst",
    department: "it",
    projects: [
      {
        id: "it-project-2",
        name: "Digital Transformation",
        description: "Enterprise-wide digital transformation",
        status: "active"
      }
    ],
    lastActive: new Date().toISOString(),
    type: "other"
  }
];