import { Collaborator } from "@/lib/types/collaboration";

export const techlabPartners: Collaborator[] = [
  {
    id: "techlab-1",
    name: "Thomas Anderson",
    email: "t.anderson@company.com",
    role: "AI Specialist",
    department: "techlab",
    projects: [
      {
        id: "ai-research",
        name: "AI Research Program",
        description: "Advanced AI systems research"
      }
    ],
    lastActive: new Date().toISOString(),
    type: "other"
  },
  {
    id: "techlab-2",
    name: "Emily Zhang",
    email: "e.zhang@company.com",
    role: "Research Scientist",
    department: "techlab",
    projects: [
      {
        id: "emerging-tech",
        name: "Emerging Technologies",
        description: "Research on emerging technologies"
      }
    ],
    lastActive: new Date().toISOString(),
    type: "other"
  },
  {
    id: "techlab-3",
    name: "Marcus Johnson",
    email: "m.johnson@company.com",
    role: "Innovation Lead",
    department: "techlab",
    projects: [
      {
        id: "innovation-lab",
        name: "Innovation Lab Projects",
        description: "Leading innovation initiatives"
      }
    ],
    lastActive: new Date().toISOString(),
    type: "other"
  },
  {
    id: "techlab-4",
    name: "Rachel Green",
    email: "r.green@company.com",
    role: "Technology Researcher",
    department: "techlab",
    projects: [
      {
        id: "tech-research",
        name: "Technology Research",
        description: "Advanced technology research"
      }
    ],
    lastActive: new Date().toISOString(),
    type: "other"
  }
];