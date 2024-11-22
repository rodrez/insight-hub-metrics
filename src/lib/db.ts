import { IndexedDBService } from './services/IndexedDBService';
import { SampleDataService } from './services/SampleDataService';
import { DataService } from './services/DataService';

const indexedDBService = new IndexedDBService();
export const db: DataService = new SampleDataService(indexedDBService);