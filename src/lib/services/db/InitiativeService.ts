import { Initiative } from "../../types/initiative";
import { BaseIndexedDBService } from "./base/BaseIndexedDBService";

export class InitiativeService extends BaseIndexedDBService {
  public async getAllInitiatives(): Promise<Initiative[]> {
    return this.transactionService.performTransaction('initiatives', 'readonly', store => store.getAll());
  }

  public async addInitiative(initiative: Initiative): Promise<void> {
    await this.transactionService.performTransaction('initiatives', 'readwrite', store => store.put(initiative));
  }

  public async updateInitiative(id: string, updates: Partial<Initiative>): Promise<void> {
    const initiative = await this.transactionService.performTransaction('initiatives', 'readonly', store => store.get(id));
    if (!initiative) throw new Error('Initiative not found');
    await this.addInitiative({ ...initiative, ...updates });
  }

  public async deleteInitiative(id: string): Promise<void> {
    await this.transactionService.performTransaction('initiatives', 'readwrite', store => store.delete(id));
  }
}