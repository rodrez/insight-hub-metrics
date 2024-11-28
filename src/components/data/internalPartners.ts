import { Collaborator } from "@/lib/types/collaboration";
import { airplanesPartners } from "./departments/airplanes";
import { helicoptersPartners } from "./departments/helicopters";
import { spacePartners } from "./departments/space";
import { generateITPartners } from "@/lib/services/data/departments/itPartners";
import { techlabPartners } from "./departments/techlab";

export const internalPartners: Collaborator[] = [
  ...airplanesPartners,
  ...helicoptersPartners,
  ...spacePartners,
  ...generateITPartners(),
  ...techlabPartners
];