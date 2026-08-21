import { Expose, Type } from 'class-transformer';
import { ResponseConfigurationParamDto } from '../paramater/response-configuration-param.dto';
import { ResponseAbstractUserDto } from '@/shared/abstract-user-management/dtos/abstract-user/response-abstract-user.dto';
import { ResponseDtoHelper } from '@/shared/database/dtos/database.response.dto';

export class ResponseConfigurationNamespaceDto extends ResponseDtoHelper {
  @Expose()
  id: string;

  @Expose()
  name?: string;

  description?: string;

  @Expose()
  @Type(() => ResponseConfigurationParamDto)
  params?: ResponseConfigurationParamDto[];

  @Expose()
  userId?: string;

  @Expose()
  @Type(() => ResponseAbstractUserDto)
  user: ResponseAbstractUserDto;
}
