import { CSVBaseService } from './CSVBaseService';
import { escapeCSVValue, formatDate } from '../../utils/csvFormatting';

export class SitRepCSVService extends CSVBaseService {
  static addSitRepsSection(items: any[], sitreps: any[] = []) {
    if (sitreps.length === 0) return;

    this.addSection(items, 'Situation Reports (SitReps)', [
      'SitRep ID',
      'Title',
      'Date',
      'Status',
      'Level',
      'Department',
      'Summary',
      'Update',
      'Challenges',
      'Next Steps'
    ]);
    
    sitreps.forEach((sitrep: any) => {
      items.push([
        sitrep.id,
        sitrep.title,
        formatDate(sitrep.date),
        sitrep.status,
        sitrep.level || 'N/A',
        sitrep.departmentId || 'N/A',
        sitrep.summary,
        sitrep.update,
        sitrep.challenges || 'N/A',
        sitrep.nextSteps || 'N/A'
      ].map(escapeCSVValue));
    });
    this.addSeparator(items);
  }
}