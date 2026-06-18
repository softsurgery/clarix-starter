import { getDataSource } from '@/shared/database/database';
import { DatabaseAbstractRepository } from '@/shared/database/repositories/database.repository';
import { RolePermissionEntity } from '../entities/role-permission.entity';

export class RolePermissionRepository extends DatabaseAbstractRepository<RolePermissionEntity> {
  constructor() {
    super(getDataSource().getRepository(RolePermissionEntity));
  }
}
