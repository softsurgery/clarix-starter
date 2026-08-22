import { ipcMain } from 'electron';
import { ChartSessionService } from '../services/chart-session.service';

export function registerChartSessionHandlers(): void {
  const service = new ChartSessionService();

  ipcMain.handle('chartSession:findAll', async () => {
    return service.findAll();
  });

  ipcMain.handle('chartSession:findOneById', async (_event, id: string) => {
    return service.findOneById(id);
  });

  ipcMain.handle('chartSession:delete', async (_event, id: string) => {
    await service.delete(id);
    return { success: true };
  });

  ipcMain.handle('chartSession:deleteAll', async () => {
    await service.deleteAll();
    return { success: true };
  });
}
