import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface JangananaDB extends DBSchema {
  households: {
    key: string;
    value: any;
    indexes: { 'by-ward': string; 'sync-status': string };
  };
  surveys: {
    key: string;
    value: any;
    indexes: { 'by-house': string; 'sync-status': string };
  };
}

let dbPromise: Promise<IDBPDatabase<JangananaDB>> | null = null;

export const getDB = () => {
  if (typeof window === 'undefined') return null;
  
  if (!dbPromise) {
    dbPromise = openDB<JangananaDB>('janganana-db', 1, {
      upgrade(db) {
        const householdStore = db.createObjectStore('households', { keyPath: 'id' });
        householdStore.createIndex('by-ward', 'wardId');
        householdStore.createIndex('sync-status', 'syncStatus');

        const surveyStore = db.createObjectStore('surveys', { keyPath: 'id' });
        surveyStore.createIndex('by-house', 'houseId');
        surveyStore.createIndex('sync-status', 'syncStatus');
      },
    });
  }
  return dbPromise;
};
