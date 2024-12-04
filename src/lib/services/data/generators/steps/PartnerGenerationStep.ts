import { Collaborator } from "@/lib/types";
import { DataQuantities } from "@/lib/types/data";
import { generateFortune30Partners } from '../fortune30Generator';
import { generateInternalPartners } from '../internalPartnersGenerator';
import { generateSMEPartners } from '../smePartnersGenerator';
import { db } from "@/lib/db";
import { DataIntegrityChecker } from "../../validation/DataIntegrityChecker";
import { TransactionManager } from "../../transaction/TransactionManager";

export class PartnerGenerationStep {
  static async execute(quantities: DataQuantities) {
    console.log('Starting partner generation step...');
    
    // Generate Fortune 30 partners first
    console.log('Generating Fortune 30 partners...');
    const fortune30Partners = await this.generateAndValidateFortune30Partners(quantities.fortune30);
    console.log('Fortune 30 partners generated:', fortune30Partners.length);
    
    // Generate internal partners second
    console.log('Generating internal partners...');
    const internalPartners = await this.generateAndValidateInternalPartners(quantities.internalPartners);
    console.log('Internal partners generated:', internalPartners.length);
    
    // Generate SME partners last
    console.log('Generating SME partners...');
    const smePartners = await this.generateAndValidateSMEPartners(quantities.smePartners);
    console.log('SME partners generated:', smePartners.length);
    
    return {
      fortune30Partners,
      internalPartners,
      smePartners
    };
  }

  private static async generateAndValidateFortune30Partners(quantity: number) {
    const partners = generateFortune30Partners().slice(0, quantity);
    
    if (!DataIntegrityChecker.validateFortune30Partners(partners)) {
      throw new Error('Fortune 30 partners validation failed');
    }

    for (const partner of partners) {
      await db.addCollaborator(partner);
      TransactionManager.addRollbackAction(async () => {
        await db.deleteCollaborator(partner.id);
      });
    }

    return partners;
  }

  private static async generateAndValidateInternalPartners(quantity: number) {
    const partners = await generateInternalPartners();
    const selectedPartners = partners.slice(0, quantity);
    
    if (!DataIntegrityChecker.validateInternalPartners(selectedPartners)) {
      throw new Error('Internal partners validation failed');
    }

    for (const partner of selectedPartners) {
      await db.addCollaborator(partner);
      TransactionManager.addRollbackAction(async () => {
        await db.deleteCollaborator(partner.id);
      });
    }

    return selectedPartners;
  }

  private static async generateAndValidateSMEPartners(quantity: number) {
    const partners = generateSMEPartners().slice(0, quantity);
    
    if (!DataIntegrityChecker.validateSMEPartners(partners)) {
      throw new Error('SME partners validation failed');
    }

    for (const partner of partners) {
      await db.addSMEPartner(partner);
      TransactionManager.addRollbackAction(async () => {
        await db.deleteSMEPartner(partner.id);
      });
    }

    return partners;
  }
}