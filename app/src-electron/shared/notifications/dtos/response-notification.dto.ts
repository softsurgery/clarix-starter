import { Expose, Type } from 'class-transformer';
import { NotificationType } from '../../../app/enums/notification-type.enum';
import { ResponseDtoHelper } from '@/shared/database/dtos/database.response.dto';
import { ResponseAbstractUserDto } from '@/shared/abstract-user-management/dtos/abstract-user/response-abstract-user.dto';

export class ResponseNotificationDto extends ResponseDtoHelper {
  @Expose()
  id: number;

  @Expose()
  type: NotificationType;

  @Expose()
  userId?: string;

  @Expose()
  @Type(() => ResponseAbstractUserDto)
  user: ResponseAbstractUserDto;

  @Expose()
  payload?: unknown;
}
