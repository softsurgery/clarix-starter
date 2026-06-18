import { ipcMain } from 'electron';
import type { FindManyQueryDto } from '@/types/find-many-query.types';
import { DataSourceEntity } from '../entities/data-source.entity';
import { DataSourceService } from '../services/data-source.service';

export function registerDataSourceHandlers(): void {
  const service = new DataSourceService();

  ipcMain.handle('dataSource:findAll', async (_event, query: FindManyQueryDto) => {
    return service.findAll(query);
  });

  ipcMain.handle('dataSource:findAllPaginated', async (_event, query: FindManyQueryDto) => {
    return service.findAllPaginated(query);
  });

  ipcMain.handle('dataSource:findOneById', async (_event, id: string) => {
    return service.findOneById(id);
  });

  ipcMain.handle('dataSource:create', async (_event, data: Partial<DataSourceEntity>) => {
    return service.save(data);
  });

  ipcMain.handle(
    'dataSource:update',
    async (_event, id: string, data: Partial<DataSourceEntity>) => {
      return service.update(id, data);
    },
  );

  ipcMain.handle('dataSource:delete', async (_event, id: string) => {
    return service.softDelete(id);
  });

  ipcMain.handle('dataSource:testConnection', async (_event, id: string) => {
    return service.testConnection(id);
  });
}
