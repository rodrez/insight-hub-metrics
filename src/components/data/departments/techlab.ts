import { Collaborator } from "@/lib/types/collaboration";

export const techlabPartners: Collaborator[] = [
  {
    id: "techlab-1",
    name: "Thomas Anderson",
    email: "t.anderson@company.com",
    role: "AI Specialist",
    department: "techlab",
    projects: [],
    lastActive: new Date().toISOString(),
    type: "other"
  },
  {
    id: "techlab-2",
    name: "Emily Zhang",
    email: "e.zhang@company.com",
    role: "Research Scientist",
    department: "techlab",
    projects: [],
    lastActive: new Date().toISOString(),
    type: "other"
  },
  {
    id: "techlab-3",
    name: "Marcus Johnson",
    email: "m.johnson@company.com",
    role: "Innovation Lead",
    department: "techlab",
    projects: [],
    lastActive: new Date().toISOString(),
    type: "other"
  },
  {
    id: "techlab-4",
    name: "Rachel Green",
    email: "r.green@company.com",
    role: "Technology Researcher",
    department: "techlab",
    projects: [],
    lastActive: new Date().toISOString(),
    type: "other"
  }
];