import { ResponseDtoHelper } from '@/shared/database/dtos/database.response.dto';
import { Expose } from 'class-transformer';

export class ResponseStorageDto extends ResponseDtoHelper {
  @Expose()
  id: number;

  @Expose()
  slug: string;

  @Expose()
  filename: string;

  @Expose()
  mimetype: string;

  @Expose()
  size: number;

  @Expose()
  isTemporary: boolean;

  @Expose()
  isPrivate: boolean;
}
