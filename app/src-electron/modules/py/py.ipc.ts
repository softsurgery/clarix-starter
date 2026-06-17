import { ipcMain } from 'electron';
import { PyRunnerService } from './py-runner.service';

export function registerPyHandlers(): void {
  const pyRunner = new PyRunnerService();

  ipcMain.handle('py:hello-cardinal', async () => {
    try {
      const result = await pyRunner.runScript('base.py', []);
      return { message: 'Success', output: result };
    } catch (error) {
      console.log(error);
      return { message: 'Error', error: error instanceof Error ? error.message : String(error) };
    }
  });
}
