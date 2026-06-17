import { ResponseRolePermissionDto } from '../role-permission/response-role-permission.dto';
import { Expose, Type } from 'class-transformer';
import { ResponseAbstractUserDto } from '../abstract-user/response-abstract-user.dto';
import { ResponseDtoHelper } from '@/shared/database/dtos/database.response.dto';

export class ResponseRoleDto extends ResponseDtoHelper {
  @Expose()
  id: string;

  @Expose()
  label: string;

  @Expose()
  description?: string;

  @Expose()
  @Type(() => ResponseRolePermissionDto)
  permissions?: ResponseRolePermissionDto[];

  @Expose()
  @Type(() => ResponseAbstractUserDto)
  users?: ResponseAbstractUserDto[];
}
