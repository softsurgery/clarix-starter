import { getDataSource } from '@/shared/database/database';
import { DatabaseAbstractRepository } from '@/shared/database/repositories/database.repository';
import { ConfigurationParamEntity } from '../entities/configuration-param.entity';

export class ConfigurationParamRepository extends DatabaseAbstractRepository<ConfigurationParamEntity> {
  constructor() {
    super(getDataSource().getRepository(ConfigurationParamEntity));
  }
}
