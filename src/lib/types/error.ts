export interface ErrorItem {
  id: string;
  type: string;
  message: string;
  stackTrace?: string;
  status: 'pending' | 'resolved';
  timestamp: number;
  priority: number;
}