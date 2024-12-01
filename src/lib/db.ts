import { IndexedDBService } from './services/IndexedDBService';
import { DataService } from './services/DataService';

// Get the singleton instance
const indexedDBService = IndexedDBService.getInstance();
export const db: DataService = indexedDBService;