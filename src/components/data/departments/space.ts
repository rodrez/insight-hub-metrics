import { Collaborator } from "@/lib/types/collaboration";

export const spacePartners: Collaborator[] = [
  {
    id: "space-1",
    name: "Michael Chang",
    email: "m.chang@company.com",
    role: "Systems Architect",
    department: "space",
    projects: [
      {
        id: "satellite-communications",
        name: "Satellite Communications",
        description: "Developing communication systems for satellites"
      }
    ],
    lastActive: new Date().toISOString(),
    type: "other"
  },
  {
    id: "space-2",
    name: "Lisa Park",
    email: "l.park@company.com",
    role: "Mission Specialist",
    department: "space",
    projects: [
      {
        id: "mission-planning",
        name: "Mission Planning Systems",
        description: "Developing mission planning software"
      }
    ],
    lastActive: new Date().toISOString(),
    type: "other"
  },
  {
    id: "space-3",
    name: "Daniel Kim",
    email: "d.kim@company.com",
    role: "Propulsion Specialist",
    department: "space",
    projects: [
      {
        id: "propulsion-systems",
        name: "Advanced Propulsion",
        description: "Next-gen spacecraft propulsion"
      }
    ],
    lastActive: new Date().toISOString(),
    type: "other"
  },
  {
    id: "space-4",
    name: "Amanda White",
    email: "a.white@company.com",
    role: "Navigation Systems Engineer",
    department: "space",
    projects: [
      {
        id: "navigation-systems",
        name: "Space Navigation",
        description: "Spacecraft navigation systems"
      }
    ],
    lastActive: new Date().toISOString(),
    type: "other"
  }
];