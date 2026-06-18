import { getDataSource } from '@/shared/database/database';
import { DatabaseAbstractRepository } from '@/shared/database/repositories/database.repository';
import { UserEntity } from '../entities/user.entity';

export class UserRepository extends DatabaseAbstractRepository<UserEntity> {
  constructor() {
    super(getDataSource().getRepository(UserEntity));
  }
}
