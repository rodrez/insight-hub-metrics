import { escapeCSVValue, formatDate } from '../utils/csvFormatting';

export class CSVExportService {
  static convertToCSV(data: any): string {
    try {
      const items = [];
      const metadata = [`Export Date: ${formatDate(new Date())}`, ''];
      items.push(metadata);
      
      this.addCollaboratorsSection(items, data.collaborators);
      this.addProjectsSection(items, data.projects);
      this.addSPIsSection(items, data.spis);

      return items.map(row => row.join(',')).join('\n');
    } catch (error) {
      console.error('Error converting data to CSV:', error);
      throw new Error('Failed to convert data to CSV format');
    }
  }

  private static addCollaboratorsSection(items: any[], collaborators: any[] = []) {
    if (collaborators.length > 0) {
      items.push(['Collaborators']);
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
          formatDate(c.updatedAt || new Date())
        ].map(escapeCSVValue));
      });
      items.push(['']);
    }
  }

  private static addProjectsSection(items: any[], projects: any[] = []) {
    if (projects.length > 0) {
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
  }

  private static addSPIsSection(items: any[], spis: any[] = []) {
    if (spis.length > 0) {
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
}