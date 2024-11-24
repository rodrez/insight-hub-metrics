import { Collaborator } from "@/lib/types/collaboration";

export const airplanesPartners: Collaborator[] = [
  {
    id: "airplanes-1",
    name: "John Smith",
    email: "john.smith@company.com",
    role: "Lead Engineer",
    department: "airplanes",
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
    id: "airplanes-2",
    name: "Robert Chen",
    email: "r.chen@company.com",
    role: "Propulsion Engineer",
    department: "airplanes",
    projects: [
      {
        id: "engine-efficiency",
        name: "Engine Efficiency Program",
        description: "Improving aircraft engine performance"
      }
    ],
    lastActive: new Date().toISOString(),
    type: "other"
  },
  {
    id: "airplanes-3",
    name: "Jennifer Lee",
    email: "j.lee@company.com",
    role: "Materials Scientist",
    department: "airplanes",
    projects: [
      {
        id: "composite-materials",
        name: "Composite Materials Research",
        description: "Developing advanced aircraft materials"
      }
    ],
    lastActive: new Date().toISOString(),
    type: "other"
  },
  {
    id: "airplanes-4",
    name: "Christopher Brown",
    email: "c.brown@company.com",
    role: "Aerodynamics Specialist",
    department: "airplanes",
    projects: [
      {
        id: "flow-simulation",
        name: "Flow Simulation Systems",
        description: "Advanced aerodynamics simulation"
      }
    ],
    lastActive: new Date().toISOString(),
    type: "other"
  }
];