import { ResponseDtoHelper } from '@/shared/database/dtos/database.response.dto';
import { RolePermissionEntity } from '../../entities/role-permission.entity';
import { Expose, Type } from 'class-transformer';

export class ResponsePermissionDto extends ResponseDtoHelper {
  @Expose()
  id: string;

  @Expose()
  label: string;

  @Expose()
  description?: string;

  @Expose()
  @Type(() => RolePermissionEntity)
  roles: RolePermissionEntity[];
}
