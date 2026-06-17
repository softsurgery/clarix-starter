import { Injectable } from '@nestjs/common';
import { NotificationRepository } from '../repositories/notification.repository';
import { NotificationEntity } from '../entities/notification.entity';
import { FindManyOptions } from 'typeorm';
import { AbstractCrudService } from '@/shared/database/services/abstract-crud.service';
import { PageDto } from '@/shared/database/dtos/database.page.dto';
import { PageMetaDto } from '@/shared/database/dtos/database.page-meta.dto';

@Injectable()
export class NotificationService extends AbstractCrudService<NotificationEntity> {
  constructor(private readonly notificationRepository: NotificationRepository) {
    super(notificationRepository);
  }

  //Extended Methods ===========================================================================

  async findAllPaginatedByUser(
    query: FindManyOptions<NotificationEntity> = {},
    userId?: string,
  ): Promise<PageDto<NotificationEntity>> {
    query.where = {
      ...(query.where || {}),
      userId,
    };

    const count = await this.notificationRepository.getTotalCount({
      where: query.where,
    });

    const entities = await this.notificationRepository.findAll(
      query as FindManyOptions<NotificationEntity>,
    );

    const pageMetaDto = new PageMetaDto({
      pageOptionsDto: {
        page: Number(query.skip),
        take: Number(query.take),
      },
      itemCount: count,
    });

    return new PageDto(entities, pageMetaDto);
  }
}
