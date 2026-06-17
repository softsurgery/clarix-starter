import { ipcMain } from 'electron';
import type { FindManyQueryDto } from '@/types/find-many-query.types';
import { CreateRoleDto } from '@/shared/abstract-user-management/dtos/role/create-role.dto';
import { UpdateRoleDto } from '@/shared/abstract-user-management/dtos/role/update-role.dto';
import { RoleService } from '@/shared/abstract-user-management/services/role.service';

export function registerRoleHandlers(): void {
  const service = new RoleService();

  ipcMain.handle('role:findAll', async (_event, query: FindManyQueryDto) => {
    return service.findAll(query);
  });

  ipcMain.handle('role:findAllPaginated', async (_event, query: FindManyQueryDto) => {
    return service.findAllPaginated(query);
  });

  ipcMain.handle('role:findOneById', async (_event, id: string) => {
    return service.findOneById(id);
  });

  ipcMain.handle('role:create', async (_event, data: CreateRoleDto) => {
    return service.saveWithPermissions({ ...data, permissions: data.permissions ?? [] });
  });

  ipcMain.handle('role:update', async (_event, id: string, data: UpdateRoleDto) => {
    return service.updateWithPermissions(id, data);
  });

  ipcMain.handle('role:delete', async (_event, id: string) => {
    return service.softDelete(id);
  });
}
