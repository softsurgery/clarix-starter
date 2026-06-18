import { AbstractCrudService } from '@/shared/database/services/abstract-crud.service';
import { DataSourceEntity } from '../entities/data-source.entity';
import { DataSourceRepository } from '../repositories/data-source.repository';
import {
  createDatabaseOperationsService,
  toConnectionConfig,
} from '../database-operations/database-operations.factory';

export interface TestConnectionResult {
  success: boolean;
  message: string;
  isActive: boolean;
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
      return {
        success: true,
        message: `Successfully connected to "${ds.name}".`,
        isActive: true,
      };
    } catch (error) {
      await this.update(id, { isActive: false });
      const message =
        error instanceof Error ? error.message : 'Connection test failed with an unknown error';
      return {
        success: false,
        message: `Failed to connect to "${ds.name}": ${message}`,
        isActive: false,
      };
    } finally {
      await operations.disconnect().catch(() => undefined);
    }
  }
}
