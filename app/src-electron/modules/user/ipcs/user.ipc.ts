import { ipcMain } from 'electron';
import type { FindManyQueryDto } from '@/types/find-many-query.types';
import { CreateAbstractUserDto } from '@/shared/abstract-user-management/dtos/abstract-user/create-abstract-user.dto';
import { UpdateAbstractUserDto } from '@/shared/abstract-user-management/dtos/abstract-user/update-abstract-user.dto';
import { UserService } from '../services/user.service';

export function registerUserHandlers(): void {
  const service = new UserService();

  ipcMain.handle('user:findAll', async (_event, query: FindManyQueryDto) => {
    return service.findAll(query);
  });

  ipcMain.handle('user:findAllPaginated', async (_event, query: FindManyQueryDto) => {
    return service.findAllPaginated(query);
  });

  ipcMain.handle('user:findOneById', async (_event, id: string) => {
    return service.findOneById(id);
  });

  ipcMain.handle('user:create', async (_event, data: CreateAbstractUserDto) => {
    return service.save({
      ...data,
      isActive: true,
      isApproved: true,
    });
  });

  ipcMain.handle('user:update', async (_event, id: string, data: UpdateAbstractUserDto) => {
    return service.update(id, data);
  });

  ipcMain.handle('user:delete', async (_event, id: string) => {
    return service.softDelete(id);
  });
}
