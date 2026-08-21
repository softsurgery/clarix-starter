import { ipcMain } from 'electron';
import type { FindManyQueryDto } from '@/types/find-many-query.types';
import { ConfigurationNamespaceService } from '@/shared/configurations/services/configuration-namespace.service';
import { ConfigurationParamService } from '@/shared/configurations/services/configuration-param.service';
import { UpdateConfigurationParamaterDto } from '@/shared/configurations/dtos/paramater/update-configuration-paramater.dto';

export function registerConfigurationHandlers(): void {
  const namespaceService = new ConfigurationNamespaceService();
  const paramService = new ConfigurationParamService();

  ipcMain.handle('configuration:findGlobalByName', async (_event, name: string) => {
    return namespaceService.findGlobalByName(name);
  });

  ipcMain.handle('configuration:findOneById', async (_event, id: string) => {
    return namespaceService.findOneByCondition({
      where: { id },
      relations: ['params'],
    });
  });

  ipcMain.handle('configuration:findAll', async (_event, query: FindManyQueryDto = {}) => {
    return namespaceService.findAll({
      ...query,
      relations: query.relations ?? ['params'],
    });
  });

  ipcMain.handle('configuration:findAllGlobal', async (_event, query: FindManyQueryDto = {}) => {
    return namespaceService.findAllGlobal(query);
  });

  ipcMain.handle(
    'configuration:updateParams',
    async (_event, dtos: UpdateConfigurationParamaterDto[]) => {
      return paramService.updateBatchParams(dtos);
    },
  );
}
