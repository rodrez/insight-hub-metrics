import { escapeCSVValue, formatDate } from '../utils/csvFormatting';

export class CSVExportService {
  static convertToCSV(data: any): string {
    if (!data) {
      throw new Error('No data provided for CSV conversion');
    }

    try {
      const items = [];
      const metadata = [`Export Date: ${formatDate(new Date())}`, ''];
      items.push(metadata);
      
      // Check if data exists before accessing properties
      if (data.collaborators && data.collaborators.length > 0) {
        this.addCollaboratorsSection(items, data.collaborators);
      }

      // Add SME partners section
      if (data.smePartners && data.smePartners.length > 0) {
        this.addSMEPartnersSection(items, data.smePartners);
      }
      
      if (data.projects && data.projects.length > 0) {
        this.addProjectsSection(items, data.projects);
      }
      
      if (data.spis && data.spis.length > 0) {
        this.addSPIsSection(items, data.spis);
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

  private static addCollaboratorsSection(items: any[], collaborators: any[] = []) {
    items.push(['Fortune 30 & Internal Collaborators']);
    items.push([
      'Collaborator ID',
      'Full Name',
      'Role Type',
      'Department',
      'Email Address',
      'Status',
      'Last Updated'
    ].map(escapeCSVValue));
    
    collaborators.forEach((c: any) => {
      items.push([
        c.id,
        c.name,
        c.type,
        c.department,
        c.email,
        c.status || 'Active',
        formatDate(c.lastActive || new Date())
      ].map(escapeCSVValue));
    });
    items.push(['']);
  }

  private static addSMEPartnersSection(items: any[], smePartners: any[] = []) {
    items.push(['SME Partners']);
    items.push([
      'Partner ID',
      'Company Name',
      'Role',
      'Department',
      'Email Address',
      'Primary Contact',
      'Contact Role',
      'Last Updated'
    ].map(escapeCSVValue));
    
    smePartners.forEach((sme: any) => {
      items.push([
        sme.id,
        sme.name,
        sme.role,
        sme.department,
        sme.email,
        sme.primaryContact?.name || 'N/A',
        sme.primaryContact?.role || 'N/A',
        formatDate(sme.lastActive || new Date())
      ].map(escapeCSVValue));
    });
    items.push(['']);
  }

  private static addProjectsSection(items: any[], projects: any[] = []) {
    items.push(['Projects']);
    items.push([
      'Project ID',
      'Project Name',
      'Current Status',
      'Department',
      'Start Date',
      'End Date',
      'Budget',
      'Priority Level'
    ].map(escapeCSVValue));
    
    projects.forEach((p: any) => {
      items.push([
        p.id,
        p.name,
        p.status,
        p.department,
        formatDate(p.startDate),
        formatDate(p.endDate),
        p.budget || 'N/A',
        p.priority || 'Medium'
      ].map(escapeCSVValue));
    });
    items.push(['']);
  }

  private static addSPIsSection(items: any[], spis: any[] = []) {
    items.push(['Strategic Partnership Initiatives (SPIs)']);
    items.push([
      'SPI ID',
      'Title',
      'Status',
      'Project ID',
      'Start Date',
      'Target Completion',
      'Actual Completion',
      'Priority'
    ].map(escapeCSVValue));
    
    spis.forEach((s: any) => {
      items.push([
        s.id,
        s.title,
        s.status,
        s.projectId,
        formatDate(s.startDate),
        formatDate(s.targetDate),
        formatDate(s.completionDate),
        s.priority || 'Medium'
      ].map(escapeCSVValue));
    });
  }
}