import { Exclude, Expose, Type } from 'class-transformer';
import { ResponseRoleDto } from '../role/response-role.dto';
import { ResponseDtoHelper } from '@/shared/database/dtos/database.response.dto';

export class ResponseAbstractUserDto extends ResponseDtoHelper {
  @Expose()
  id: string;

  @Expose()
  firstName?: string;

  @Expose()
  lastName?: string;

  @Expose()
  dateOfBirth?: Date;

  @Expose()
  isActive?: boolean;

  @Expose()
  isApproved?: boolean;

  @Exclude()
  password?: string;

  @Expose()
  username: string;

  @Expose()
  email: string;

  @Expose()
  emailVerified?: Date;

  @Expose()
  @Type(() => ResponseRoleDto)
  role: ResponseRoleDto;

  @Expose()
  roleId: string;
}
