import { IsOptional, IsString, Length, IsArray } from 'class-validator';
import { RolePermissionEntity } from '../../entities/role-permission.entity';

export class CreateRoleDto {
  @IsString()
  @Length(3, 50)
  label: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsArray()
  permissions: Pick<RolePermissionEntity, 'permissionId'>[];
}
