import { CSVBaseService } from './CSVBaseService';
import { escapeCSVValue } from '../../utils/csvFormatting';
import { BusinessCategory, LOB } from '@/components/wiki/data/businessCategories';

export class LOBCSVService extends CSVBaseService {
  static addLOBSection(items: any[], categories: BusinessCategory[] = []) {
    if (categories.length === 0) return;

    this.addSection(items, 'Lines of Business (LOB)', [
      'Category',
      'LOB Name',
      'Department',
      'Description',
      'Primary Contact',
      'Contact Role',
      'Contact Email',
      'Contact Phone'
    ]);
    
    categories.forEach((category) => {
      category.lobs.forEach((lob) => {
        const primaryContact = category.contacts[0] || {};
        items.push([
          category.name,
          lob.name,
          lob.department,
          category.description,
          primaryContact.name || 'N/A',
          primaryContact.role || 'N/A',
          primaryContact.email || 'N/A',
          primaryContact.phone || 'N/A'
        ].map(escapeCSVValue));
      });
    });
    this.addSeparator(items);
  }
}