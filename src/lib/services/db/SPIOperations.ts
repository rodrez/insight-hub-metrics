import { SPI } from '../../types/spi';
import { BaseDBService } from './base/BaseDBService';

export class SPIOperations extends BaseDBService {
  async deleteSPI(id: string): Promise<void> {
    await this.ensureInitialized();
    await this.performTransaction('spis', 'readwrite', store => store.delete(id));
  }
}