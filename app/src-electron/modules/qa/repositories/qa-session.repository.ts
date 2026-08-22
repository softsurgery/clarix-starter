import { getDataSource } from '@/shared/database/database';
import { DatabaseAbstractRepository } from '@/shared/database/repositories/database.repository';
import { QASessionEntity } from '../entities/qa-session.entity';

export class QASessionRepository extends DatabaseAbstractRepository<QASessionEntity> {
  constructor() {
    super(getDataSource().getRepository(QASessionEntity));
  }
}
