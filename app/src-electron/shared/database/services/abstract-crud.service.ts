import { DeepPartial, FindOneOptions, ObjectLiteral } from 'typeorm';
import type { FindManyQueryDto } from '@/types/find-many-query.types';
import { DatabaseAbstractRepository } from '../repositories/database.repository';
import { PageDto } from '../dtos/database.page.dto';
import { PageMetaDto } from '../dtos/database.page-meta.dto';
import { toFindManyOptions } from '../utils/find-many-query.builder';

export class AbstractCrudService<T extends ObjectLiteral> {
  repository: DatabaseAbstractRepository<T>;
  constructor(repository: DatabaseAbstractRepository<T>) {
    this.repository = repository;
  }

  async findOneById(
    id: number | string,
    query?: Pick<FindOneOptions<T>, 'join'>,
  ): Promise<T | null> {
    const entity = await this.repository.findOne({
      ...query,
      where: { id },
    } as any);
    if (!entity) {
      throw new Error(`${this.repository.getMetadata().name} with id ${id} is not found`);
    }
    return entity;
  }

  async findOneByCondition(query: FindOneOptions<T>): Promise<T | null> {
    const entity = await this.repository.findOne(query);
    if (!entity) return null;
    return entity;
  }

  async findAll(query: FindManyQueryDto = {}): Promise<T[]> {
    return await this.repository.findAll(toFindManyOptions<T>(query));
  }

  async findAllPaginated(query: FindManyQueryDto = {}): Promise<PageDto<T>> {
    const options = toFindManyOptions<T>(query);
    const take = Number(options.take) || 10;
    const skipVal = Number(options.skip) || 0;

    const count = await this.repository.getTotalCount({
      where: options.where,
    });

    const entities = await this.repository.findAll(options);

    const pageMetaDto = new PageMetaDto({
      pageOptionsDto: {
        page: Math.floor(skipVal / take) + 1,
        take,
      },
      itemCount: count,
    });

    return new PageDto(entities, pageMetaDto);
  }

  async save(dto: DeepPartial<T>) {
    return this.repository.save(dto);
  }

  async saveMany(dtos: DeepPartial<T>[]) {
    return this.repository.saveMany(dtos);
  }

  async update(id: string | number, dto: Partial<T>) {
    const entity = await this.findOneById(id);
    if (!entity) throw new Error('Entity not found');
    return this.repository.update(id, dto);
  }

  async updateMany(dtos: DeepPartial<T>[]) {
    return this.repository.saveMany(dtos);
  }

  async softDelete(id: string | number): Promise<T | null> {
    return this.repository.softDelete(id);
  }

  async delete(id: string | number): Promise<T | null> {
    const entity = await this.findOneById(id);
    if (!entity) throw new Error('Entity not found');
    return this.repository.remove(entity);
  }
}
