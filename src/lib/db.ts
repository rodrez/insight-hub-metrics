import { IndexedDBService } from './services/IndexedDBService';
import { DataService } from './services/DataService';

// Create singleton instance
const indexedDBService = new IndexedDBService();
export const db: DataService = indexedDBService;