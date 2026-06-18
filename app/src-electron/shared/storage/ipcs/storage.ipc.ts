import { LocalStorageService } from '@/shared/storage/services/local-storage.service';
import { ipcMain } from 'electron';
import type { FindManyQueryDto } from '@/types/find-many-query.types';

export function registerStorageHandlers(): void {
  const service = new LocalStorageService();

  ipcMain.handle('storage:store', async (_event, fileData: Express.Multer.File) => {
    return service.store({
      buffer: Buffer.from(fileData.buffer),
      originalname: fileData.originalname,
      mimetype: fileData.mimetype,
      size: fileData.size,
    } as Express.Multer.File);
  });

  ipcMain.handle(
    'storage:storeMultipleFiles',
    async (_event, files: Express.Multer.File[], isTemporary = false, isPrivate = false) => {
      return service.storeMultipleFiles(files, isTemporary, isPrivate);
    },
  );

  ipcMain.handle('storage:loadResource', async (_event, slug: string) => {
    return service.loadResource(slug);
  });

  ipcMain.handle('storage:duplicate', async (_event, id: number) => {
    return service.duplicate(id);
  });

  ipcMain.handle('storage:findAll', async (_event, query: FindManyQueryDto) => {
    return service.findAll(query);
  });

  ipcMain.handle('storage:findOneById', async (_event, id: number) => {
    return service.findOneById(id);
  });

  ipcMain.handle('storage:findBySlug', async (_event, slug: string) => {
    return service.findBySlug(slug);
  });

  ipcMain.handle('storage:expose', async (_event, id: number) => {
    return service.expose(id);
  });

  ipcMain.handle('storage:hide', async (_event, id: number) => {
    return service.hide(id);
  });

  ipcMain.handle('storage:confirm', async (_event, id: number) => {
    return service.confirm(id);
  });

  ipcMain.handle('storage:unconfirm', async (_event, id: number) => {
    return service.unconfirm(id);
  });

  ipcMain.handle('storage:findTemporary', async () => {
    return service.findTemporary();
  });

  ipcMain.handle('storage:softDelete', async (_event, id: number) => {
    return service.softDelete(String(id));
  });

  ipcMain.handle('storage:getFilePath', async (_event, id: number) => {
    return service.getFilePath(id);
  });
}
