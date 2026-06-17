import { getDataSource } from '@/shared/database/database';
import { DatabaseAbstractRepository } from '@/shared/database/repositories/database.repository';
import { PermissionEntity } from '../entities/permission.entity';

export class PermissionRepository extends DatabaseAbstractRepository<PermissionEntity> {
  constructor() {
    super(getDataSource().getRepository(PermissionEntity));
  }
}
