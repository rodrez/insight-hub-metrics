import { SPI } from '../../types/spi';
import { BaseDBService } from './base/BaseDBService';

export class SPIService extends BaseDBService {
  async getAllSPIs(): Promise<SPI[]> {
    return this.performTransaction<SPI[]>(
      'spis',
      'readonly',
      store => store.getAll()
    );
  }

  async getSPI(id: string): Promise<SPI | undefined> {
    return this.performTransaction<SPI | undefined>(
      'spis',
      'readonly',
      store => store.get(id)
    );
  }

  async addSPI(spi: SPI): Promise<void> {
    await this.performTransaction(
      'spis',
      'readwrite',
      store => store.put(spi)
    );
  }

  async updateSPI(id: string, updates: Partial<SPI>): Promise<void> {
    const existingSPI = await this.getSPI(id);
    if (!existingSPI) {
      throw new Error('SPI not found');
    }
    await this.performTransaction(
      'spis',
      'readwrite',
      store => store.put({ ...existingSPI, ...updates })
    );
  }
}