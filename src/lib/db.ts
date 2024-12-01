import { IndexedDBService } from './services/IndexedDBService';

// Get the singleton instance
const indexedDBService = IndexedDBService.getInstance();
export const db: DataService = indexedDBService;