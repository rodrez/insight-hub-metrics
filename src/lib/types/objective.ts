export type Objective = {
  id: string;
  title: string;
  description: string;
  desiredOutcome: string;
  spiIds: string[];
  initiativeId?: string;
};