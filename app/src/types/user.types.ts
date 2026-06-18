import { DatabaseEntity } from './utils/database-entity';
import { ResponseRoleDto } from './role.types';

export interface ResponseUserDto extends DatabaseEntity {
  id: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: Date;
  isActive?: boolean;
  isApproved?: boolean;
  username: string;
  email: string;
  emailVerified?: Date;
  role: ResponseRoleDto;
  roleId: string;
}

export interface CreateUserDto {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: Date;
  password: string;
  username: string;
  email: string;
  roleId: string;
}

export interface UpdateUserDto extends Partial<Omit<CreateUserDto, 'password'>> {
  password?: string;
  isActive?: boolean;
}

export interface AuthUserDto {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: ResponseRoleDto;
  roleId: string;
}

export interface LoginCredentials {
  usernameOrEmail: string;
  password: string;
}
