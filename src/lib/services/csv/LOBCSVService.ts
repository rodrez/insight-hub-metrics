import { CSVBaseService } from './CSVBaseService';
import { escapeCSVValue } from '../../utils/csvFormatting';
import { BusinessCategory, Contact } from '@/components/wiki/data/businessCategories';

export class LOBCSVService extends CSVBaseService {
  static addLOBSection(items: any[], categories: BusinessCategory[] = []) {
    if (categories.length === 0) return;

    this.addSection(items, 'Lines of Business (LOB)', [
      'Category',
      'LOB Name',
      'Department',
      'Description',
      'Contact Name',
      'Contact Role',
      'Contact Email',
      'Contact Phone',
      'Contact Notes'
    ]);
    
    categories.forEach((category) => {
      category.lobs.forEach((lob) => {
        // For each LOB, create multiple rows - one for each contact
        category.contacts.forEach((contact: Contact) => {
          items.push([
            category.name,
            lob.name,
            lob.department,
            category.description,
            contact.name,
            contact.role,
            contact.email,
            contact.phone,
            contact.notes || 'N/A'
          ].map(escapeCSVValue));
        });

        // If no contacts exist, add one row with N/A values
        if (category.contacts.length === 0) {
          items.push([
            category.name,
            lob.name,
            lob.department,
            category.description,
            'N/A',
            'N/A',
            'N/A',
            'N/A',
            'N/A'
          ].map(escapeCSVValue));
        }
      });
    });
    this.addSeparator(items);
  }
}