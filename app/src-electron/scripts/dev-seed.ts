import { getDataSource } from '../shared/database/database';
import { seedGlobalConfigurations } from '../modules/agent/ollama-configuration.seeder';

export async function runDevSeed() {
  getDataSource();
  await seedGlobalConfigurations();
  console.log('[Seed] Seeding complete.');
}

// Support running as a standalone script
if (process.argv.some((arg) => arg.includes('dev-seed'))) {
  const { app } = require('electron');
  const { initializeDatabase } = require('../shared/database/database');

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
