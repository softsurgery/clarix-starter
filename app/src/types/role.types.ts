import { DatabaseEntity } from './utils/database-entity';

export interface ResponseRoleDto extends DatabaseEntity {
  id: string;
  label: string;
  description?: string;
}

export interface CreateRoleDto {
  label: string;
  description?: string;
  permissions?: { permissionId: string }[];
}

export interface UpdateRoleDto extends Partial<CreateRoleDto> {}
