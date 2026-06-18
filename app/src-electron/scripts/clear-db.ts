import { app } from 'electron';
import { initializeDatabase } from '../shared/database/database';

export async function clearDb() {
  const dataSource = await initializeDatabase();
  console.log('[Clear DB] Dropping schema...');
  await dataSource.dropDatabase();
  console.log('[Clear DB] Re-syncing schema...');
  await dataSource.synchronize();
  console.log('[Clear DB] Database cleared successfully.');
}

// Support running as a standalone script
if (process.argv.some(arg => arg.includes('clear-db'))) {
  app.whenReady().then(async () => {
    try {
      await clearDb();
      app.quit();
      process.exit(0);
    } catch (error) {
      console.error('[Clear DB] Error:', error);
      app.quit();
      process.exit(1);
    }
  });
}
