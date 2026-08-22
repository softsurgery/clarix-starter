import { AbstractCrudService } from '@/shared/database/services/abstract-crud.service';
import { ConfigurationParamEntity } from '@/shared/configurations/entities/configuration-param.entity';
import { ConfigurationParamRepository } from '@/shared/configurations/repositories/configuration-param.repository';
import { ParamVariant } from '@/shared/configurations/enums/param-variant.enum';

export interface UpdateConfigurationParamaterDto {
  id: number;
  value: string;
}

export class ConfigurationParamService extends AbstractCrudService<ConfigurationParamEntity> {
  constructor() {
    super(new ConfigurationParamRepository());
  }

  static isValidValue(param: ConfigurationParamEntity, value: string): boolean {
    switch (param.variant) {
      case ParamVariant.STRING:
        return true;
      case ParamVariant.NUMBER:
        return !Number.isNaN(Number(value));
      case ParamVariant.BOOLEAN:
        return value === 'true' || value === 'false';
      case ParamVariant.SELECT:
        return param.options?.some((option) => option.value === value) ?? false;
      default:
        return false;
    }
  }

  async updateBatchParams(
    dtos: UpdateConfigurationParamaterDto[],
  ): Promise<(ConfigurationParamEntity | null)[]> {
    return Promise.all(
      dtos.map(async (dto) => {
        const entity = await this.findOneById(dto.id);

        if (!entity) {
          throw new Error('Configuration parameter not found');
        }

        if (!ConfigurationParamService.isValidValue(entity, dto.value)) {
          throw new Error(`Invalid value for configuration parameter "${entity.name}"`);
        }

        return this.repository.update(dto.id, { value: dto.value });
      }),
    );
  }
}
