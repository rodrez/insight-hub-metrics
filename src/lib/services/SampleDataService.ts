import { DataQuantities } from '@/lib/types/data';
import { SampleDataCoordinator } from './data/SampleDataCoordinator';
import { errorHandler } from './error/ErrorHandlingService';

export class SampleDataService {
  private coordinator: SampleDataCoordinator;

  constructor() {
    this.coordinator = new SampleDataCoordinator();
  }

  async generateSampleData(quantities: Partial<DataQuantities> = {}): Promise<void> {
    try {
      const validatedQuantities = {
        projects: quantities.projects ?? 10,
        spis: quantities.spis ?? 10,
        objectives: quantities.objectives ?? 5,
        sitreps: quantities.sitreps ?? 10,
        fortune30: quantities.fortune30 ?? 6,
        internalPartners: quantities.internalPartners ?? 20,
        smePartners: quantities.smePartners ?? 10
      };

      await this.coordinator.generateData(validatedQuantities);
    } catch (error) {
      errorHandler.handleError(error, {
        type: 'database',
        title: 'Sample Data Generation Failed',
      });
      throw error;
    }
  }
}