import { SPI } from '../../types/spi';
import { BaseIndexedDBService } from './base/BaseIndexedDBService';

export class SPIOperations extends BaseIndexedDBService {
  async deleteSPI(id: string): Promise<void> {
    await this.ensureInitialized();
    await this.transactionService.performTransaction('spis', 'readwrite', store => store.delete(id));
  }
}