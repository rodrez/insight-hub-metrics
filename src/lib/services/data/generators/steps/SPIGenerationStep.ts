import { SPI } from "@/lib/types/spi";
import { Project } from "@/lib/types";
import { DataQuantities } from "@/lib/types/data";
import { generateSampleSPIs } from '../spiGenerator';
import { db } from "@/lib/db";
import { DataIntegrityChecker } from "../../validation/DataIntegrityChecker";
import { TransactionManager } from "../../transaction/TransactionManager";

export class SPIGenerationStep {
  static async execute(quantities: DataQuantities, projects: Project[]) {
    console.log('Starting SPI generation step...');
    const spis = generateSampleSPIs(projects.map(p => p.id), quantities.spis);
    
    if (!DataIntegrityChecker.validateSPIs(spis)) {
      throw new Error('SPIs validation failed');
    }

    for (const spi of spis) {
      await db.addSPI(spi);
      TransactionManager.addRollbackAction(async () => {
        await db.deleteSPI(spi.id);
      });
    }

    console.log('SPIs generated:', spis.length);
    return spis;
  }
}