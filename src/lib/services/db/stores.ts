export const DB_CONFIG = {
  name: 'projectManagementDB',
  version: 1,
  stores: {
    projects: 'projects',
    collaborators: 'collaborators',
    sitreps: 'sitreps',
    spis: 'spis'
  }
};

export const createStores = (db: IDBDatabase) => {
  // Remove existing object stores if they exist during upgrade
  Array.from(db.objectStoreNames).forEach(storeName => {
    db.deleteObjectStore(storeName);
  });

  // Create fresh object stores
  console.log('Creating projects store');
  db.createObjectStore(DB_CONFIG.stores.projects, { keyPath: 'id' });

  console.log('Creating collaborators store');
  db.createObjectStore(DB_CONFIG.stores.collaborators, { keyPath: 'id' });

  console.log('Creating sitreps store');
  db.createObjectStore(DB_CONFIG.stores.sitreps, { keyPath: 'id' });

  console.log('Creating spis store');
  db.createObjectStore(DB_CONFIG.stores.spis, { keyPath: 'id' });
};