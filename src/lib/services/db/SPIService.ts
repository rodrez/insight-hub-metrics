import { SPI } from "../../types/spi";
import { Objective } from "../../types/objective";
import { BaseIndexedDBService } from "./base/BaseIndexedDBService";

export class SPIService extends BaseIndexedDBService {
  public async getAllSPIs(): Promise<SPI[]> {
    return this.transactionService.performTransaction('spis', 'readonly', store => store.getAll());
  }

  public async getSPI(id: string): Promise<SPI | undefined> {
    return this.transactionService.performTransaction('spis', 'readonly', store => store.get(id));
  }

  public async addSPI(spi: SPI): Promise<void> {
    await this.transactionService.performTransaction('spis', 'readwrite', store => store.put(spi));
  }

  public async updateSPI(id: string, updates: Partial<SPI>): Promise<void> {
    const spi = await this.getSPI(id);
    if (!spi) throw new Error('SPI not found');
    await this.addSPI({ ...spi, ...updates });
  }

  public async deleteSPI(id: string): Promise<void> {
    await this.transactionService.performTransaction('spis', 'readwrite', store => store.delete(id));
  }

  public async getAllObjectives(): Promise<Objective[]> {
    return this.transactionService.performTransaction('objectives', 'readonly', store => store.getAll());
  }

  public async addObjective(objective: Objective): Promise<void> {
    await this.transactionService.performTransaction('objectives', 'readwrite', store => store.put(objective));
  }

  public async updateObjective(id: string, updates: Partial<Objective>): Promise<void> {
    const objective = await this.transactionService.performTransaction('objectives', 'readonly', store => store.get(id));
    if (!objective) throw new Error('Objective not found');
    await this.addObjective({ ...objective, ...updates });
  }

  public async deleteObjective(id: string): Promise<void> {
    await this.transactionService.performTransaction('objectives', 'readwrite', store => store.delete(id));
  }
}