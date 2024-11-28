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
}