import 'reflect-metadata';
import { vi, describe, it, expect, beforeAll, afterAll } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

// Mock electron before importing anything that depends on it
vi.mock('electron', () => ({
  app: {
    getPath: vi.fn((name) => {
      if (name === 'userData') return path.join(os.homedir(), '.config', 'clarix-desktop');
      return '/tmp';
    }),
    isPackaged: false,
    whenReady: vi.fn().mockResolvedValue(true),
    quit: vi.fn(),
  },
}));

import { DataSourceService } from './modules/data-source/services/data-source.service';
import {
  createDatabaseOperationsService,
  toConnectionConfig,
} from './modules/data-source/database-operations/database-operations.factory';
import { initializeDatabase } from './shared/database/database';

describe('QA Queries Data Source Tests', () => {
  let dataSourceService: DataSourceService;
  // Adjusted path since this file is in app/src-electron
  const testDir = path.resolve(__dirname, '../../test');

  const dirs = fs.existsSync(testDir)
    ? fs
        .readdirSync(testDir, { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => dirent.name)
    : [];

  beforeAll(async () => {
    await initializeDatabase();
    dataSourceService = new DataSourceService();
  });

  for (const dir of dirs) {
    describe(`Testing queries for ${dir}`, () => {
      let operationsService: any;
      let qaFilePath = path.join(testDir, dir, 'Q&A.md');

      beforeAll(async () => {
        // Detect data source
        const dataSources = await dataSourceService.findAll();
        // Assume data source name or defaultDatabase contains the dir name
        const ds = dataSources.find(
          (d) =>
            d.name.toLowerCase().includes(dir.toLowerCase()) ||
            d.defaultDatabase?.toLowerCase().includes(dir.toLowerCase()),
        );

        if (!ds) {
          throw new Error(`Could not detect data source for ${dir}`);
        }

        operationsService = createDatabaseOperationsService(ds.type, toConnectionConfig(ds));
      });

      afterAll(async () => {
        if (operationsService) {
          await operationsService.disconnect();
        }
      });

      if (!fs.existsSync(qaFilePath)) {
        it.skip(`Skipping tests because ${qaFilePath} does not exist`, () => {});
        return;
      }

      const content = fs.readFileSync(qaFilePath, 'utf-8');
      const queryBlocks = [
        ...content.matchAll(/###\s*(.*?)\n[\s\S]*?\*\*Query:\*\*\s*```sql\n([\s\S]*?)```/g),
      ];

      if (queryBlocks.length === 0) {
        it('should have parsed at least one query', () => {
          expect(queryBlocks.length).toBeGreaterThan(0);
        });
      }

      for (const match of queryBlocks) {
        const questionName = match[1].trim();
        const sql = match[2].trim();

        it(`should execute query: ${questionName}`, async () => {
          expect(operationsService).toBeDefined();
          const result = await operationsService.executeQuery(sql);
          expect(result).toBeDefined();
          expect(Array.isArray(result)).toBe(true);
        });
      }
    });
  }
});
