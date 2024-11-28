import { Collaborator } from "@/lib/types/collaboration";
import { 
  airplanesPartners,
  helicoptersPartners,
  spacePartners,
  generateITPartners,
  techlabPartners
} from "@/lib/services/data/departments/sampleDepartments";

export const internalPartners: Collaborator[] = [
  ...airplanesPartners,
  ...helicoptersPartners,
  ...spacePartners,
  ...generateITPartners(),
  ...techlabPartners
];