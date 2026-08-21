import { getDataSource } from '@/shared/database/database';
import { DatabaseAbstractRepository } from '@/shared/database/repositories/database.repository';
import { ConfigurationNamespaceEntity } from '../entities/configuration-namespace.entity';

export class ConfigurationNamespaceRepository extends DatabaseAbstractRepository<ConfigurationNamespaceEntity> {
  constructor() {
    super(getDataSource().getRepository(ConfigurationNamespaceEntity));
  }
}
