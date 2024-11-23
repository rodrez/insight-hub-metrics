import { Collaborator } from "@/lib/types/collaboration";

export const internalPartners: Collaborator[] = [
  {
    id: "aerospace-1",
    name: "John Smith",
    email: "john.smith@company.com",
    role: "Lead Engineer",
    department: "Airplanes",
    projects: [
      {
        id: "wing-design",
        name: "Wing Design Optimization",
        description: "Optimizing wing designs for better aerodynamics"
      }
    ],
    lastActive: new Date().toISOString(),
    type: "other"
  },
  {
    id: "space-1",
    name: "Michael Chang",
    email: "m.chang@company.com",
    role: "Systems Architect",
    department: "Space",
    projects: [
      {
        id: "satellite-communications",
        name: "Satellite Communications",
        description: "Developing communication systems for satellites"
      }
    ],
    lastActive: new Date().toISOString(),
    type: "other"
  }
];