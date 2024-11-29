import { SampleDataQuantities } from '../DataService';
import { BaseDBService } from './base/BaseDBService';
import { DataGenerationService } from '../data/DataGenerationService';

export class SampleDataPopulationService extends BaseDBService {
  private dataGenerationService: DataGenerationService;

  constructor() {
    super();
    this.dataGenerationService = new DataGenerationService();
  }

  async populateData(quantities: SampleDataQuantities): Promise<void> {
    const result = await this.dataGenerationService.generateAndSaveData(quantities);
    if (!result.success) {
      throw result.error;
    }
  }
}