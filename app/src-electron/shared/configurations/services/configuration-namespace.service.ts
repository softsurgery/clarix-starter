import { AbstractCrudService } from '@/shared/database/services/abstract-crud.service';
import type { FindManyQueryDto } from '@/types/find-many-query.types';
import { toFindManyOptions } from '@/shared/database/utils/find-many-query.builder';
import { FindManyOptions, IsNull } from 'typeorm';
import { ConfigurationNamespaceEntity } from '@/shared/configurations/entities/configuration-namespace.entity';
import { ConfigurationNamespaceRepository } from '@/shared/configurations/repositories/configuration-namespace.repository';
import { ParamVariant } from '@/shared/configurations/enums/param-variant.enum';

export class ConfigurationNamespaceService extends AbstractCrudService<ConfigurationNamespaceEntity> {
  constructor() {
    super(new ConfigurationNamespaceRepository());
  }

  async getSpecificParam(
    namespace: string,
    param: string,
    userId: string | null = null,
  ): Promise<string | number | boolean | null> {
    const namespaceEntity = await this.repository.findOne({
      where: {
        name: namespace,
        userId: userId === null ? IsNull() : userId,
      },
      relations: ['params'],
    });

    if (!namespaceEntity) return null;

    const paramEntity = namespaceEntity.params.find((p) => p.name === param);

    switch (paramEntity?.variant) {
      case ParamVariant.STRING:
      case ParamVariant.SELECT:
        return paramEntity.value;
      case ParamVariant.NUMBER:
        return Number(paramEntity.value);
      case ParamVariant.BOOLEAN:
        return paramEntity.value === 'true';
      default:
        return null;
    }
  }

  async findAllGlobal(query: FindManyQueryDto = {}): Promise<ConfigurationNamespaceEntity[]> {
    const options = toFindManyOptions<ConfigurationNamespaceEntity>(
      query,
    ) as FindManyOptions<ConfigurationNamespaceEntity>;
    options.where = {
      ...(options.where as object),
      userId: IsNull(),
    };
    options.relations = options.relations ?? ['params'];

    return this.repository.findAll(options);
  }

  async findGlobalByName(name: string): Promise<ConfigurationNamespaceEntity | null> {
    return this.repository.findOne({
      where: { name, userId: IsNull() },
      relations: ['params'],
    });
  }

  async deleteByUserId(userId: string): Promise<void> {
    const namespaces = await this.repository.findWithRelations({
      where: { userId },
      select: ['id'],
    });

    if (namespaces.length === 0) return;

    const namespaceIds = namespaces.map((n) => n.id);

    await this.repository
      .createQueryBuilder()
      .delete()
      .from('configuration-param')
      .where('namespaceId IN (:...namespaceIds)', { namespaceIds })
      .execute();

    await this.repository
      .createQueryBuilder()
      .delete()
      .from('configuration-namespace')
      .where('userId = :userId', { userId })
      .execute();
  }
}
