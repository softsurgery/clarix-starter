import { ipcMain } from 'electron';
import { getSharedPyRunnerService } from './py-instance';

export function registerPyHandlers(): void {
  ipcMain.handle('py:hello-cardinal', async () => {
    try {
      const result = await getSharedPyRunnerService().runScript('base.py', []);
      return { message: 'Success', output: result };
    } catch (error) {
      console.log(error);
      return { message: 'Error', error: error instanceof Error ? error.message : String(error) };
    }
  });
}
