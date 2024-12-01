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
      'Primary Contact',
      'Contact Role',
      'Contact Email',
      'Contact Phone'
    ]);
    
    categories.forEach((category) => {
      category.lobs.forEach((lob) => {
        const primaryContact: Contact = category.contacts[0] || {
          name: 'N/A',
          role: 'N/A',
          email: 'N/A',
          phone: 'N/A'
        };
        
        items.push([
          category.name,
          lob.name,
          lob.department,
          category.description,
          primaryContact.name,
          primaryContact.role,
          primaryContact.email,
          primaryContact.phone
        ].map(escapeCSVValue));
      });
    });
    this.addSeparator(items);
  }
}