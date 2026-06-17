import { Injectable } from '@nestjs/common';
import { StorageEntity } from '../entities/storage.entity';
import { DatabaseAbstractRepository } from '@/shared/database/repositories/database.repository';
import { getDataSource } from '@/shared/database/database';

@Injectable()
export class StorageRepository extends DatabaseAbstractRepository<StorageEntity> {
  constructor() {
    super(getDataSource().getRepository(StorageEntity));
  }
}
