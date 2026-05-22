import { getDB } from './indexed-db';

export class SyncManager {
  static async syncLocalToRemote() {
    const db = await getDB();
    if (!db) return;

    // 1. Get unsynced households
    const unsyncedHouseholds = await db.getAllFromIndex('households', 'sync-status', 'pending');
    for (const house of unsyncedHouseholds) {
      try {
        // Mock remote sync
        // await api.post('/households', house);
        house.syncStatus = 'synced';
        await db.put('households', house);
      } catch (e) {
        console.error('Failed to sync household', e);
      }
    }

    // 2. Get unsynced surveys
    const unsyncedSurveys = await db.getAllFromIndex('surveys', 'sync-status', 'pending');
    for (const survey of unsyncedSurveys) {
      try {
        // Mock remote sync
        // await api.post('/surveys', survey);
        survey.syncStatus = 'synced';
        await db.put('surveys', survey);
      } catch (e) {
        console.error('Failed to sync survey', e);
      }
    }
  }

  static async saveOfflineData(storeName: 'households' | 'surveys', data: any) {
    const db = await getDB();
    if (!db) return;

    const entry = { ...data, syncStatus: 'pending' };
    await db.put(storeName, entry);
  }
}
