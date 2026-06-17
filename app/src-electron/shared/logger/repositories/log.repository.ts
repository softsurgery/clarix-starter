import { DatabaseAbstractRepository } from '@/shared/database/repositories/database.repository';
import { getDataSource } from '@/shared/database/database';
import { LogEntity } from '../entities/log.entity';

export class LoggerRepository extends DatabaseAbstractRepository<LogEntity> {
  constructor() {
    super(getDataSource().getRepository(LogEntity));
  }
}
