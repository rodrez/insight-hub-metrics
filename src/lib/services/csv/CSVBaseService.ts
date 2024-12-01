import { escapeCSVValue, formatDate } from '../../utils/csvFormatting';

export abstract class CSVBaseService {
  protected static addSection(items: any[], title: string, headers: string[]) {
    items.push([title]);
    items.push(headers.map(escapeCSVValue));
  }

  protected static formatDate(date: string | undefined): string {
    return date ? formatDate(date) : 'N/A';
  }

  protected static addSeparator(items: any[]) {
    items.push(['']);
  }
}