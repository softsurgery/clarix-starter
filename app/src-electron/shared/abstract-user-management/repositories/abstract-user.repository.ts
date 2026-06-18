import { DatabaseAbstractRepository } from '@/shared/database/repositories/database.repository';
import { getDataSource } from '@/shared/database/database';
import { AbstractUserEntity } from '../entities/abstract-user.entity';

export class AbstractUserRepository extends DatabaseAbstractRepository<AbstractUserEntity> {
  constructor() {
    super(getDataSource().getRepository(AbstractUserEntity));
  }
}
