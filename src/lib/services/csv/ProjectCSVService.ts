import { CSVBaseService } from './CSVBaseService';
import { escapeCSVValue, formatDate } from '../../utils/csvFormatting';

export class ProjectCSVService extends CSVBaseService {
  static addProjectsSection(items: any[], projects: any[] = []) {
    if (projects.length === 0) return;

    this.addSection(items, 'Projects', [
      'Project ID',
      'Project Name',
      'Current Status',
      'Department',
      'Start Date',
      'End Date',
      'Budget',
      'Priority Level'
    ]);
    
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
    this.addSeparator(items);
  }
}