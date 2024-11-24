export const DB_CONFIG = {
  name: 'projectManagementDB',
  version: 1,
  stores: {
    projects: 'projects',
    collaborators: 'collaborators'
  }
};

export const createStores = (db: IDBDatabase) => {
  if (!db.objectStoreNames.contains(DB_CONFIG.stores.projects)) {
    console.log('Creating projects store');
    db.createObjectStore(DB_CONFIG.stores.projects, { keyPath: 'id' });
  }

  if (!db.objectStoreNames.contains(DB_CONFIG.stores.collaborators)) {
    console.log('Creating collaborators store');
    db.createObjectStore(DB_CONFIG.stores.collaborators, { keyPath: 'id' });
  }
};