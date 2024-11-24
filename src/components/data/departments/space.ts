import { Collaborator } from "@/lib/types/collaboration";

export const spacePartners: Collaborator[] = [
  {
    id: "space-1",
    name: "Michael Chang",
    email: "m.chang@company.com",
    role: "Systems Architect",
    department: "space",
    projects: [],
    lastActive: new Date().toISOString(),
    type: "other"
  },
  {
    id: "space-2",
    name: "Lisa Park",
    email: "l.park@company.com",
    role: "Mission Specialist",
    department: "space",
    projects: [],
    lastActive: new Date().toISOString(),
    type: "other"
  },
  {
    id: "space-3",
    name: "Daniel Kim",
    email: "d.kim@company.com",
    role: "Propulsion Specialist",
    department: "space",
    projects: [],
    lastActive: new Date().toISOString(),
    type: "other"
  },
  {
    id: "space-4",
    name: "Amanda White",
    email: "a.white@company.com",
    role: "Navigation Systems Engineer",
    department: "space",
    projects: [],
    lastActive: new Date().toISOString(),
    type: "other"
  }
];