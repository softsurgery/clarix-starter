import { ipcMain } from 'electron';
import { QASessionService } from '../services/qa-session.service';

export function registerQASessionHandlers(): void {
  const service = new QASessionService();

  ipcMain.handle('qaSession:findAll', async () => {
    return service.findAll();
  });

  ipcMain.handle('qaSession:findOneById', async (_event, id: string) => {
    return service.findOneById(id);
  });

  ipcMain.handle('qaSession:delete', async (_event, id: string) => {
    await service.delete(id);
    return { success: true };
  });

  ipcMain.handle('qaSession:deleteAll', async () => {
    await service.deleteAll();
    return { success: true };
  });
}
