import { Collaborator } from "@/lib/types/collaboration";
import { GenerationResult } from "@/lib/types/data";
import { BaseGenerationService } from "../base/BaseGenerationService";
import { generateFortune30Partners } from "../generators/fortune30Generator";

export class Fortune30GenerationService extends BaseGenerationService<Collaborator> {
  async generate(quantity: number): Promise<GenerationResult<Collaborator>> {
    const partners = generateFortune30Partners();
    const selectedPartners = partners.slice(0, quantity);
    
    this.showProgress("Fortune 30 Partners", selectedPartners.length);
    
    return {
      data: selectedPartners,
      count: selectedPartners.length
    };
  }
}