import { DataQuantities } from '@/components/data/types/dataTypes';
import { SampleDataCoordinator } from './SampleDataCoordinator';
import { errorHandler } from '../error/ErrorHandlingService';

export class SampleDataService {
  private coordinator: SampleDataCoordinator;

  constructor() {
    this.coordinator = new SampleDataCoordinator();
  }

  async generateSampleData(quantities: DataQuantities): Promise<void> {
    try {
      await this.coordinator.generateData(quantities);
    } catch (error) {
      errorHandler.handleError(error, {
        type: 'database',
        title: 'Sample Data Generation Failed',
      });
      throw error;
    }
  }
}