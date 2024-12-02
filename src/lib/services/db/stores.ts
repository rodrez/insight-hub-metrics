export const DB_CONFIG = {
  name: 'projectsDB',
  version: 1,
};

export const createStores = (db: IDBDatabase) => {
  if (!db.objectStoreNames.contains('projects')) {
    db.createObjectStore('projects', { keyPath: 'id' });
  }

  if (!db.objectStoreNames.contains('collaborators')) {
    db.createObjectStore('collaborators', { keyPath: 'id' });
  }

  if (!db.objectStoreNames.contains('sitreps')) {
    db.createObjectStore('sitreps', { keyPath: 'id' });
  }

  if (!db.objectStoreNames.contains('spis')) {
    db.createObjectStore('spis', { keyPath: 'id' });
  }

  if (!db.objectStoreNames.contains('objectives')) {
    db.createObjectStore('objectives', { keyPath: 'id' });
  }

  if (!db.objectStoreNames.contains('initiatives')) {
    db.createObjectStore('initiatives', { keyPath: 'id' });
  }

  if (!db.objectStoreNames.contains('smePartners')) {
    db.createObjectStore('smePartners', { keyPath: 'id' });
  }
};
