import { getDataSource } from '@/shared/database/database';
import { DatabaseAbstractRepository } from '@/shared/database/repositories/database.repository';
import { DataSourceEntity } from '../entities/data-source.entity';

export class DataSourceRepository extends DatabaseAbstractRepository<DataSourceEntity> {
  constructor() {
    super(getDataSource().getRepository(DataSourceEntity));
  }
}
