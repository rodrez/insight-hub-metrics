import { Collaborator } from "@/lib/types";
import { generateId } from "../utils/dataGenerationUtils";

export function generateInternalPartner(
  name: string,
  email: string,
  role: string,
  department: string
): Collaborator {
  return {
    id: generateId(),
    name,
    email,
    role,
    department,
    type: 'internal',
    projects: [],
    lastActive: new Date().toISOString(),
  };
}
