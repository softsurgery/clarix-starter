import { app } from 'electron';
import { getDataSource, initializeDatabase } from '../shared/database/database';

export async function runDevSeed() {
  const dataSource = getDataSource();

 
  console.log('[Seed] Seeding complete.');
}

// Support running as a standalone script
if (process.argv.some((arg) => arg.includes('dev-seed'))) {
  app.whenReady().then(async () => {
    try {
      await initializeDatabase();
      await runDevSeed();
      app.quit();
      process.exit(0);
    } catch (error) {
      console.error('[Seed] Error:', error);
      app.quit();
      process.exit(1);
    }
  });
}
