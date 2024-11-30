import { BaseDBService } from './base/BaseDBService';
import { DataGenerationService } from '../data/DataGenerationService';
import { errorHandler } from '../error/ErrorHandlingService';

export class SampleDataPopulationService extends BaseDBService {
  private dataGenerationService: DataGenerationService;

  constructor() {
    super();
    this.dataGenerationService = new DataGenerationService();
  }

  async populateData(): Promise<void> {
    try {
      const result = await this.dataGenerationService.generateAndSaveData();
      if (!result.success) {
        throw result.error || new Error('Failed to generate and save data');
      }
    } catch (error) {
      errorHandler.handleError(error, {
        type: 'database',
        title: 'Data Population Failed'
      });
      throw error;
    }
  }
}