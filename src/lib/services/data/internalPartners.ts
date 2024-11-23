import { Collaborator } from "@/lib/types/collaboration";
import { DEPARTMENTS } from "@/lib/constants";

const generateInternalPartner = (name: string, departmentId: string): Collaborator => {
  const department = DEPARTMENTS.find(d => d.id === departmentId);
  return {
    id: `${departmentId}-${name.toLowerCase().replace(/\s+/g, '-')}`,
    name,
    email: `${name.toLowerCase().replace(/\s+/g, '.')}@company.com`,
    role: "Internal Partner",
    department: departmentId,
    projects: [],
    lastActive: new Date().toISOString(),
    type: "other",
    color: department?.color
  };
};

export const generateInternalPartners = (): Collaborator[] => {
  return [
    generateInternalPartner("Sarah Johnson", "airplanes"),
    generateInternalPartner("Michael Chen", "helicopters"),
    generateInternalPartner("David Rodriguez", "space"),
    generateInternalPartner("Emily Thompson", "energy"),
    generateInternalPartner("James Wilson", "it"),
    generateInternalPartner("Lisa Anderson", "techlab"),
    generateInternalPartner("Robert Kim", "airplanes"),
    generateInternalPartner("Maria Garcia", "helicopters"),
    generateInternalPartner("John Smith", "space"),
    generateInternalPartner("Amanda Lee", "energy"),
    generateInternalPartner("Thomas Brown", "it"),
    generateInternalPartner("Rachel Martinez", "techlab")
  ];
};