import { getDataSource } from '@/shared/database/database';
import { DatabaseAbstractRepository } from '@/shared/database/repositories/database.repository';
import { ChartSessionEntity } from '../entities/chart-session.entity';

export class ChartSessionRepository extends DatabaseAbstractRepository<ChartSessionEntity> {
  constructor() {
    super(getDataSource().getRepository(ChartSessionEntity));
  }
}
