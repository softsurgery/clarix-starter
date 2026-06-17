import { AbstractCrudService } from '@/shared/database/services/abstract-crud.service';
import { Injectable } from '@nestjs/common';
import { PermissionEntity } from '../entities/permission.entity';
import { PermissionRepository } from '../repositories/permission.repository';

@Injectable()
export class PermissionService extends AbstractCrudService<PermissionEntity> {
  constructor(private readonly permissionRepository: PermissionRepository) {
    super(permissionRepository);
  }
}
