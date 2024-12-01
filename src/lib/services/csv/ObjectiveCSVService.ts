import { CSVBaseService } from './CSVBaseService';
import { escapeCSVValue } from '../../utils/csvFormatting';

export class ObjectiveCSVService extends CSVBaseService {
  static addObjectivesSection(items: any[], objectives: any[] = []) {
    if (objectives.length === 0) return;

    this.addSection(items, 'Objectives', [
      'Objective ID',
      'Title',
      'Description',
      'Initiative',
      'Desired Outcome',
      'Associated SPIs'
    ]);
    
    objectives.forEach((obj: any) => {
      items.push([
        obj.id,
        obj.title,
        obj.description,
        obj.initiative,
        obj.desiredOutcome,
        (obj.spiIds || []).join('; ')
      ].map(escapeCSVValue));
    });
    this.addSeparator(items);
  }
}