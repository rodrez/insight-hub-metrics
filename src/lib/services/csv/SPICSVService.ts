import { CSVBaseService } from './CSVBaseService';
import { escapeCSVValue, formatDate } from '../../utils/csvFormatting';

export class SPICSVService extends CSVBaseService {
  static addSPIsSection(items: any[], spis: any[] = []) {
    if (spis.length === 0) return;

    this.addSection(items, 'Strategic Partnership Initiatives (SPIs)', [
      'SPI ID',
      'Title',
      'Status',
      'Project ID',
      'Start Date',
      'Target Completion',
      'Actual Completion',
      'Priority'
    ]);
    
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
    this.addSeparator(items);
  }
}