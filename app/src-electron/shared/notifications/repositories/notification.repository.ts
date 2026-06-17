import { DatabaseAbstractRepository } from '@/shared/database/repositories/database.repository';
import { NotificationEntity } from '../entities/notification.entity';
import { getDataSource } from '@/shared/database/database';

export class NotificationRepository extends DatabaseAbstractRepository<NotificationEntity> {
  constructor() {
    super(getDataSource().getRepository(NotificationEntity));
  }
}
