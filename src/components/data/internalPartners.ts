import { Collaborator } from "@/lib/types/collaboration";
import { airplanesPartners } from "./departments/airplanes";
import { helicoptersPartners } from "./departments/helicopters";
import { spacePartners } from "./departments/space";
import { itPartners } from "./departments/it";
import { techlabPartners } from "./departments/techlab";

export const internalPartners: Collaborator[] = [
  ...airplanesPartners,
  ...helicoptersPartners,
  ...spacePartners,
  ...itPartners,
  ...techlabPartners
];