import { getDataSource } from '@/shared/database/database';
import { DatabaseAbstractRepository } from '@/shared/database/repositories/database.repository';
import { RoleEntity } from '../entities/role.entity';

export class RoleRepository extends DatabaseAbstractRepository<RoleEntity> {
  constructor() {
    super(getDataSource().getRepository(RoleEntity));
  }
}
