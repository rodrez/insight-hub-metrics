export const DB_CONFIG = {
  name: 'projectDB',
  version: 1,
  stores: [
    'projects',
    'collaborators',
    'sitreps',
    'spis',
    'objectives',
    'smePartners',
    'initiatives'
  ]
};

export const createStores = (db: IDBDatabase) => {
  const stores = DB_CONFIG.stores;
  stores.forEach(storeName => {
    if (!db.objectStoreNames.contains(storeName)) {
      db.createObjectStore(storeName, { keyPath: 'id' });
    }
  });
};