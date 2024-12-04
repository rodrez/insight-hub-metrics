export const DB_CONFIG = {
  name: 'projectManagementDB',
  version: 3, // Increment version to trigger upgrade
  stores: {
    projects: 'projects',
    collaborators: 'collaborators',
    sitreps: 'sitreps',
    spis: 'spis',
    objectives: 'objectives',
    smePartners: 'smePartners'
  }
};

export const createStores = (db: IDBDatabase) => {
  // Remove existing object stores if they exist during upgrade
  Array.from(db.objectStoreNames).forEach(storeName => {
    try {
      db.deleteObjectStore(storeName);
    } catch (error) {
      console.warn(`Failed to delete store ${storeName}:`, error);
    }
  });

  // Create fresh object stores with proper configurations
  console.log('Creating projects store');
  db.createObjectStore(DB_CONFIG.stores.projects, { keyPath: 'id' });

  console.log('Creating collaborators store');
  const collaboratorsStore = db.createObjectStore(DB_CONFIG.stores.collaborators, { 
    keyPath: 'id',
    autoIncrement: false
  });
  collaboratorsStore.createIndex('type', 'type', { unique: false });
  collaboratorsStore.createIndex('department', 'department', { unique: false });

  console.log('Creating sitreps store');
  db.createObjectStore(DB_CONFIG.stores.sitreps, { keyPath: 'id' });

  console.log('Creating spis store');
  db.createObjectStore(DB_CONFIG.stores.spis, { keyPath: 'id' });

  console.log('Creating objectives store');
  db.createObjectStore(DB_CONFIG.stores.objectives, { keyPath: 'id' });

  console.log('Creating smePartners store');
  const smeStore = db.createObjectStore(DB_CONFIG.stores.smePartners, { 
    keyPath: 'id',
    autoIncrement: false
  });
  smeStore.createIndex('type', 'type', { unique: false });
};