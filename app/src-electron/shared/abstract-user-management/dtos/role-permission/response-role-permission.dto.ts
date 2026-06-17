import { ResponseRoleDto } from '../role/response-role.dto';
import { ResponsePermissionDto } from '../permission/response-permission.dto';
import { Expose, Type } from 'class-transformer';
import { ResponseDtoHelper } from '@/shared/database/dtos/database.response.dto';

export class ResponseRolePermissionDto extends ResponseDtoHelper {
  @Expose()
  id: number;

  @Expose()
  roleId: string;

  @Expose()
  @Type(() => ResponseRoleDto)
  role?: ResponseRoleDto;

  @Expose()
  permissionId: string;

  @Expose()
  @Type(() => ResponsePermissionDto)
  permission?: ResponsePermissionDto;
}
