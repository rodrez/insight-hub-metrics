import { Collaborator } from "@/lib/types/collaboration";

export const airplanesPartners: Collaborator[] = [
  {
    id: "airplanes-1",
    name: "John Smith",
    email: "john.smith@company.com",
    role: "Lead Engineer",
    department: "airplanes",
    projects: [],
    lastActive: new Date().toISOString(),
    type: "other"
  },
  {
    id: "airplanes-2",
    name: "Robert Chen",
    email: "r.chen@company.com",
    role: "Propulsion Engineer",
    department: "airplanes",
    projects: [],
    lastActive: new Date().toISOString(),
    type: "other"
  },
  {
    id: "airplanes-3",
    name: "Jennifer Lee",
    email: "j.lee@company.com",
    role: "Materials Scientist",
    department: "airplanes",
    projects: [],
    lastActive: new Date().toISOString(),
    type: "other"
  },
  {
    id: "airplanes-4",
    name: "Christopher Brown",
    email: "c.brown@company.com",
    role: "Aerodynamics Specialist",
    department: "airplanes",
    projects: [],
    lastActive: new Date().toISOString(),
    type: "other"
  }
];