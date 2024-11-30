export const DB_CONFIG = {
  name: 'projectManagementDB',
  version: 2, // Incrementing version to force store creation
  stores: {
    projects: 'projects',
    collaborators: 'collaborators',
    sitreps: 'sitreps',
    spis: 'spis',
    objectives: 'objectives',
    smePartners: 'smePartners',
    errors: 'errors'
  }
};

export const createStores = (db: IDBDatabase) => {
  // Remove existing object stores if they exist during upgrade
  Array.from(db.objectStoreNames).forEach(storeName => {
    try {
      db.deleteObjectStore(storeName);
    } catch (error) {
      console.log(`Could not delete store ${storeName}:`, error);
    }
  });

  // Create fresh object stores with detailed logging
  Object.entries(DB_CONFIG.stores).forEach(([key, storeName]) => {
    console.log(`Creating ${storeName} store`);
    db.createObjectStore(storeName, { keyPath: 'id' });
    console.log(`Successfully created ${storeName} store`);
  });
};