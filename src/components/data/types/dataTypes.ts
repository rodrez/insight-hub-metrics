export interface DataCounts {
  projects: number;
  spis: number;
  objectives: number;
  sitreps: number;
  fortune30: number;
  internalPartners: number;
  smePartners: number;
}

export interface DataQuantities {
  projects: number;
  spis: number;
  objectives: number;
  sitreps: number;
  fortune30: number;
  internalPartners: number;
  smePartners: number;
}

export const DEFAULT_QUANTITIES: DataQuantities = {
  projects: 6,
  fortune30: 6,
  internalPartners: 20,
  smePartners: 6,
  spis: 10,
  objectives: 5,
  sitreps: 10
};