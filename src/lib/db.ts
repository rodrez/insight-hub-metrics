import { IndexedDBService } from './services/IndexedDBService';
import { DataService } from './services/DataService';

const indexedDBService = new IndexedDBService();
export const db: DataService = indexedDBService;