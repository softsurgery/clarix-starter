import { Expose, Type } from 'class-transformer';
import { ResponseDtoHelper } from '@/shared/database/dtos/database.response.dto';
import { ParamVariant } from '@/shared/configurations/enums/param-variant.enum';
import { ResponseConfigurationNamespaceDto } from '@/shared/configurations/dtos/namespace/response-configuration-namespace.dto';

export class ResponseConfigurationParamDto extends ResponseDtoHelper {
  @Expose()
  id: string;

  @Expose()
  name?: string;

  @Expose()
  description?: string;

  @Expose()
  @Type(() => ResponseConfigurationNamespaceDto)
  namespace: ResponseConfigurationNamespaceDto;

  @Expose()
  namespaceId: string;

  @Expose()
  variant: ParamVariant;

  @Expose()
  value?: string;

  @Expose()
  options?: { label: string; value: string }[];
}
