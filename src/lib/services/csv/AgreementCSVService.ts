import { CSVBaseService } from './CSVBaseService';
import { escapeCSVValue } from '../../utils/csvFormatting';

export class AgreementCSVService extends CSVBaseService {
  static addAgreementsSection(items: any[], collaborators: any[] = []) {
    const collaboratorsWithAgreements = collaborators.filter(c => c.agreements);
    if (collaboratorsWithAgreements.length === 0) return;

    this.addSection(items, 'Agreements (NDAs & JTDAs)', [
      'Partner ID',
      'Partner Name',
      'NDA Status',
      'NDA Signed Date',
      'NDA Expiry Date',
      'JTDA Status',
      'JTDA Signed Date',
      'JTDA Expiry Date'
    ]);
    
    collaboratorsWithAgreements.forEach((c: any) => {
      items.push([
        c.id,
        c.name,
        c.agreements.nda?.status || 'N/A',
        this.formatDate(c.agreements.nda?.signedDate),
        this.formatDate(c.agreements.nda?.expiryDate),
        c.agreements.jtda?.status || 'N/A',
        this.formatDate(c.agreements.jtda?.signedDate),
        this.formatDate(c.agreements.jtda?.expiryDate)
      ].map(escapeCSVValue));
    });
    this.addSeparator(items);
  }
}