import { Expose, Type } from 'class-transformer';
import { ResponseDtoHelper } from '@/shared/database/dtos/database.response.dto';
import { EventType } from '@/app/enums/event-type.enum';
import { ResponseAbstractUserDto } from '@/shared/abstract-user-management/dtos/abstract-user/response-abstract-user.dto';

export class ResponseLogDto extends ResponseDtoHelper {
  @Expose()
  id: number;

  @Expose()
  event: EventType;

  @Expose()
  api?: string;

  @Expose()
  method?: string;

  @Expose()
  userId?: string;

  @Expose()
  @Type(() => ResponseAbstractUserDto)
  user: ResponseAbstractUserDto;

  @Expose()
  logInfo?: unknown;
}
