import { SitRep } from '../../types/sitrep';
import { BaseDBService } from './base/BaseDBService';

export class SitRepService extends BaseDBService {
  async getAllSitReps(): Promise<SitRep[]> {
    return this.performTransaction<SitRep[]>(
      'sitreps',
      'readonly',
      store => store.getAll()
    );
  }

  async addSitRep(sitrep: SitRep): Promise<void> {
    await this.performTransaction(
      'sitreps',
      'readwrite',
      store => store.put(sitrep)
    );
  }

  async updateSitRep(id: string, updates: Partial<SitRep>): Promise<void> {
    const existingSitRep = await this.performTransaction<SitRep | undefined>(
      'sitreps',
      'readonly',
      store => store.get(id)
    );

    if (!existingSitRep) {
      throw new Error('SitRep not found');
    }

    const updatedSitRep = { ...existingSitRep, ...updates };
    await this.performTransaction(
      'sitreps',
      'readwrite',
      store => store.put(updatedSitRep)
    );
  }
}