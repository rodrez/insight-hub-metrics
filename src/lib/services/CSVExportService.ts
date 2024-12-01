import { escapeCSVValue, formatDate } from '../utils/csvFormatting';
import { CollaboratorCSVService } from './csv/CollaboratorCSVService';
import { ProjectCSVService } from './csv/ProjectCSVService';
import { AgreementCSVService } from './csv/AgreementCSVService';
import { ObjectiveCSVService } from './csv/ObjectiveCSVService';
import { SitRepCSVService } from './csv/SitRepCSVService';
import { SPICSVService } from './csv/SPICSVService';

export class CSVExportService {
  static convertToCSV(data: any): string {
    if (!data) {
      throw new Error('No data provided for CSV conversion');
    }

    try {
      const items = [];
      const metadata = [`Export Date: ${formatDate(new Date())}`, ''];
      items.push(metadata);
      
      // Add Fortune 30 partners section
      if (data.collaborators && data.collaborators.length > 0) {
        CollaboratorCSVService.addFortune30Section(items, data.collaborators);
        CollaboratorCSVService.addInternalPartnersSection(items, data.collaborators);
      }

      // Add SME partners section
      if (data.smePartners && data.smePartners.length > 0) {
        CollaboratorCSVService.addSMEPartnersSection(items, data.smePartners);
      }
      
      if (data.projects && data.projects.length > 0) {
        ProjectCSVService.addProjectsSection(items, data.projects);
      }

      // Add Agreements section
      if (data.collaborators && data.collaborators.length > 0) {
        AgreementCSVService.addAgreementsSection(items, data.collaborators);
      }
      
      if (data.objectives && data.objectives.length > 0) {
        ObjectiveCSVService.addObjectivesSection(items, data.objectives);
      }

      if (data.sitreps && data.sitreps.length > 0) {
        SitRepCSVService.addSitRepsSection(items, data.sitreps);
      }
      
      if (data.spis && data.spis.length > 0) {
        SPICSVService.addSPIsSection(items, data.spis);
      }

      // If no data sections were added, add a message
      if (items.length === 1) { // Only metadata exists
        items.push(['No data available for export']);
      }

      return items.map(row => row.join(',')).join('\n');
    } catch (error) {
      console.error('Error converting data to CSV:', error);
      throw new Error('Failed to convert data to CSV format');
    }
  }
}