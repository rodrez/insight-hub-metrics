import { Collaborator } from "@/lib/types/collaboration";

export const helicoptersPartners: Collaborator[] = [
  {
    id: "helicopters-1",
    name: "Sarah Wilson",
    email: "s.wilson@company.com",
    role: "Rotor Systems Engineer",
    department: "helicopters",
    projects: [
      {
        id: "helicopters-project-1",
        name: "Advanced Rotor Systems",
        description: "Developing advanced rotor systems",
        status: "active"
      }
    ],
    lastActive: new Date().toISOString(),
    type: "internal"
  },
  {
    id: "helicopters-2",
    name: "Michael Zhang",
    email: "m.zhang@company.com",
    role: "Structural Engineer",
    department: "helicopters",
    projects: [
      {
        id: "helicopters-project-2",
        name: "Composite Materials Integration",
        description: "Integrating new composite materials",
        status: "active"
      }
    ],
    lastActive: new Date().toISOString(),
    type: "internal"
  },
  {
    id: "helicopters-3",
    name: "Emily Parker",
    email: "e.parker@company.com",
    role: "Systems Integration",
    department: "helicopters",
    projects: [
      {
        id: "helicopters-project-1",
        name: "Advanced Rotor Systems",
        description: "Developing advanced rotor systems",
        status: "active"
      }
    ],
    lastActive: new Date().toISOString(),
    type: "internal"
  },
  {
    id: "helicopters-4",
    name: "David Kumar",
    email: "d.kumar@company.com",
    role: "Flight Test Engineer",
    department: "helicopters",
    projects: [
      {
        id: "helicopters-project-2",
        name: "Composite Materials Integration",
        description: "Integrating new composite materials",
        status: "active"
      }
    ],
    lastActive: new Date().toISOString(),
    type: "internal"
  }
];
