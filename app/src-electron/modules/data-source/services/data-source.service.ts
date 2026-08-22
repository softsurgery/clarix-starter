import { AbstractCrudService } from '@/shared/database/services/abstract-crud.service';
import { DataSourceEntity } from '../entities/data-source.entity';
import { DataSourceRepository } from '../repositories/data-source.repository';
import { DataSourceType } from '../enums/data-source-type.enm';
import {
  createDatabaseOperationsService,
  toConnectionConfig,
} from '../../../shared/database-operations/database-operations.factory';
import type { DatabaseConnectionConfig } from '../../../shared/database-operations/types/database-operations.types';

export interface TestConnectionResult {
  success: boolean;
  message: string;
  isActive: boolean;
}

export interface ListDatabasesInput {
  id?: string;
  type?: DataSourceType;
  host?: string;
  port?: number;
  username?: string;
  password?: string;
  ssl?: boolean;
  defaultDatabase?: string;
}

export interface ListDatabasesResult {
  success: boolean;
  databases: string[];
  message?: string;
}

export class DataSourceService extends AbstractCrudService<DataSourceEntity> {
  constructor() {
    super(new DataSourceRepository());
  }

  async testConnection(id: string): Promise<TestConnectionResult> {
    const ds = await this.findOneByCondition({ where: { id } });
    if (!ds) {
      return { success: false, message: 'Data source not found', isActive: false };
    }

    const operations = createDatabaseOperationsService(ds.type, toConnectionConfig(ds));

    try {
      await operations.testConnection();
      await this.update(id, { isActive: true });
      console.log(`Successfully connected to "${ds.name}".`);
      return {
        success: true,
        message: `Successfully connected to "${ds.name}".`,
        isActive: true,
      };
    } catch (error) {
      await this.update(id, { isActive: false });
      const message =
        error instanceof Error ? error.message : 'Connection test failed with an unknown error';
      console.error(`Failed to connect to "${ds.name}": ${message}`);
      return {
        success: false,
        message: `Failed to connect to "${ds.name}": ${message}`,
        isActive: false,
      };
    } finally {
      await operations.disconnect().catch(() => undefined);
    }
  }

  async listDatabases(input: ListDatabasesInput): Promise<ListDatabasesResult> {
    const resolved = await this.resolveConnection(input);
    if (!resolved.ok) {
      return { success: false, databases: [], message: resolved.message };
    }

    const operations = createDatabaseOperationsService(resolved.type, resolved.config);

    try {
      const databases = await operations.listDatabases();
      return { success: true, databases };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to list databases with an unknown error';
      return { success: false, databases: [], message };
    } finally {
      await operations.disconnect().catch(() => undefined);
    }
  }

  private async resolveConnection(input: ListDatabasesInput): Promise<
    | { ok: true; type: DataSourceType; config: DatabaseConnectionConfig }
    | { ok: false; message: string }
  > {
    let entity: Partial<DataSourceEntity> = {};

    if (input.id) {
      const ds = await this.findOneByCondition({ where: { id: input.id } });
      if (!ds) {
        return { ok: false, message: 'Data source not found' };
      }
      entity = ds;
    }

    const type = (input.type ?? entity.type) as DataSourceType | undefined;
    const host = input.host ?? entity.host;
    const port = input.port ?? entity.port;
    const username = input.username ?? entity.username;
    const password = input.password || entity.password;
    const ssl = input.ssl ?? entity.ssl;

    if (!type || !host || !port || !username || !password) {
      return { ok: false, message: 'Fill in host, port, username, and password first' };
    }

    const config = toConnectionConfig({
      host,
      port,
      username,
      password,
      ssl,
      defaultDatabase:
        type === DataSourceType.ORACLE
          ? input.defaultDatabase || entity.defaultDatabase
          : undefined,
    });

    return { ok: true, type, config };
  }
}
