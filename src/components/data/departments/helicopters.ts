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
        id: "rotor-dynamics",
        name: "Rotor Dynamics Optimization",
        description: "Improving rotor system efficiency"
      }
    ],
    lastActive: new Date().toISOString(),
    type: "other"
  },
  {
    id: "helicopters-2",
    name: "Michael Zhang",
    email: "m.zhang@company.com",
    role: "Structural Engineer",
    department: "helicopters",
    projects: [
      {
        id: "airframe-design",
        name: "Airframe Design Innovation",
        description: "Advanced helicopter airframe design"
      }
    ],
    lastActive: new Date().toISOString(),
    type: "other"
  },
  {
    id: "helicopters-3",
    name: "Emily Parker",
    email: "e.parker@company.com",
    role: "Systems Integration",
    department: "helicopters",
    projects: [
      {
        id: "avionics-integration",
        name: "Avionics Integration",
        description: "Next-gen avionics systems"
      }
    ],
    lastActive: new Date().toISOString(),
    type: "other"
  },
  {
    id: "helicopters-4",
    name: "David Kumar",
    email: "d.kumar@company.com",
    role: "Flight Test Engineer",
    department: "helicopters",
    projects: [
      {
        id: "flight-testing",
        name: "Flight Test Program",
        description: "Comprehensive flight testing"
      }
    ],
    lastActive: new Date().toISOString(),
    type: "other"
  }
];