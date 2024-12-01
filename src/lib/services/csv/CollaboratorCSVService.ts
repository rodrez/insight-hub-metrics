import { CSVBaseService } from './CSVBaseService';
import { escapeCSVValue, formatDate } from '../../utils/csvFormatting';

export class CollaboratorCSVService extends CSVBaseService {
  static addFortune30Section(items: any[], collaborators: any[] = []) {
    const fortune30Partners = collaborators.filter(c => c.type === 'fortune30');
    if (fortune30Partners.length === 0) return;

    this.addSection(items, 'Fortune 30 Collaborators', [
      'Collaborator ID',
      'Full Name',
      'Department',
      'Email Address',
      'Role',
      'Status',
      'Last Updated'
    ]);
    
    fortune30Partners.forEach((c: any) => {
      items.push([
        c.id,
        c.name,
        c.department,
        c.email,
        c.role,
        c.status || 'Active',
        formatDate(c.lastActive || new Date())
      ].map(escapeCSVValue));
    });
    this.addSeparator(items);
  }

  static addInternalPartnersSection(items: any[], collaborators: any[] = []) {
    const internalPartners = collaborators.filter(c => c.type === 'internal');
    if (internalPartners.length === 0) return;

    this.addSection(items, 'Internal Collaborators', [
      'Collaborator ID',
      'Full Name',
      'Department',
      'Email Address',
      'Role',
      'Status',
      'Last Updated'
    ]);
    
    internalPartners.forEach((c: any) => {
      items.push([
        c.id,
        c.name,
        c.department,
        c.email,
        c.role,
        c.status || 'Active',
        formatDate(c.lastActive || new Date())
      ].map(escapeCSVValue));
    });
    this.addSeparator(items);
  }

  static addSMEPartnersSection(items: any[], smePartners: any[] = []) {
    if (smePartners.length === 0) return;

    this.addSection(items, 'SME Partners', [
      'Partner ID',
      'Company Name',
      'Role',
      'Department',
      'Email Address',
      'Primary Contact',
      'Contact Role',
      'Last Updated'
    ]);
    
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
    this.addSeparator(items);
  }
}