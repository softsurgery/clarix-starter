import { Injectable } from '@nestjs/common';
import { LogEntity } from '../entities/log.entity';
import { AbstractCrudService } from '@/shared/database/services/abstract-crud.service';
import { LoggerRepository } from '../repositories/log.repository';

@Injectable()
export class LoggerService extends AbstractCrudService<LogEntity> {
  constructor(private readonly loggerRepository: LoggerRepository) {
    super(loggerRepository);
  }
}
