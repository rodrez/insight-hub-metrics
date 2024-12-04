import { DataQuantities } from '@/lib/types/data';
import { DataGenerationService } from './data/DataGenerationService';
import { errorHandler } from './error/ErrorHandlingService';

export class SampleDataService {
  private dataGenerationService: DataGenerationService;

  constructor() {
    this.dataGenerationService = new DataGenerationService();
  }

  async generateSampleData(quantities: DataQuantities): Promise<void> {
    try {
      console.log('Starting sample data generation with quantities:', quantities);
      const result = await this.dataGenerationService.generateAndSaveData(quantities);
      
      if (!result.success) {
        throw result.error || new Error('Failed to generate and save data');
      }
    } catch (error) {
      errorHandler.handleError(error, {
        type: 'database',
        title: 'Sample Data Generation Failed'
      });
      throw error;
    }
  }
}