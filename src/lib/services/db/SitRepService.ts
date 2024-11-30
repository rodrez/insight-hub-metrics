import { SitRep } from "../../types/sitrep";
import { BaseIndexedDBService } from "./base/BaseIndexedDBService";

export class SitRepService extends BaseIndexedDBService {
  async getAllSitReps(): Promise<SitRep[]> {
    return this.transactionService.performTransaction('sitreps', 'readonly', store => store.getAll());
  }

  async addSitRep(sitrep: SitRep): Promise<void> {
    await this.transactionService.performTransaction('sitreps', 'readwrite', store => store.put(sitrep));
  }

  async updateSitRep(id: string, updates: Partial<SitRep>): Promise<void> {
    const sitrep = await this.transactionService.performTransaction('sitreps', 'readonly', store => store.get(id));
    if (!sitrep) throw new Error('SitRep not found');
    await this.addSitRep({ ...sitrep, ...updates });
  }
}