import 'reflect-metadata';
import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import { applyWindowIcon, registerAppIdentity, resolveAppIconPath } from './app-icon';
import { initializeDatabase } from './shared/database/database';
import { registerStorageHandlers } from './shared/storage/ipcs/storage.ipc';
import { registerUserHandlers } from './modules/user/ipcs/user.ipc';
import { registerRoleHandlers } from './modules/role/ipcs/role.ipc';
import { registerAuthHandlers } from './modules/auth/ipcs/auth.ipc';
import { registerPyHandlers } from './modules/py/py.ipc';
import { registerAgentHandlers } from './modules/agent/ipcs/agent.ipc';
import { registerDataSourceHandlers } from './modules/data-source/ipcs/data-source.ipc';
import { registerQAHandlers } from './modules/qa/ipcs/qa.ipc';
import { registerQASessionHandlers } from './modules/qa/ipcs/qa-session.ipc';
import { registerChartsHandlers } from './modules/charts/ipcs/charts.ipc';
import { registerChartSessionHandlers } from './modules/charts/ipcs/chart-session.ipc';
import { registerConfigurationHandlers } from './shared/configurations/ipcs/configuration.ipc';
import { initSharedOllamaService } from './modules/agent/services/ollama-instance';
import { initSharedPyRunnerService } from './modules/py/py-instance';
import { seedGlobalConfigurations } from './modules/agent/ollama-configuration.seeder';
import { runDevSeed } from './scripts/dev-seed';
import { seedUsersAndRoles } from './scripts/seed-users';

registerAppIdentity();

// IPC Handlers
ipcMain.handle('ping', () => 'pong');

function createWindow(): void {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    title: 'Clarix',
    show: false,
    icon: resolveAppIconPath(),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  applyWindowIcon(win);
  win.once('ready-to-show', () => {
    applyWindowIcon(win);
    win.show();
  });

  if (!app.isPackaged) {
    // DEV → Load Angular dev server
    win.loadURL('http://localhost:4200');
    win.webContents.openDevTools();
  } else {
    // PROD → Load built files
    win.loadFile(path.join(__dirname, '..', 'dist', 'clarix', 'browser', 'index.html'));
  }
}

app.whenReady().then(async () => {
  await initializeDatabase();

  if (!app.isPackaged) {
    await runDevSeed();
  }
  await seedUsersAndRoles();
  await seedGlobalConfigurations();
  await initSharedOllamaService();
  await initSharedPyRunnerService();

  registerStorageHandlers();
  registerUserHandlers();
  registerRoleHandlers();
  registerAuthHandlers();
  registerPyHandlers();
  registerAgentHandlers();
  registerDataSourceHandlers();
  registerQAHandlers();
  registerQASessionHandlers();
  registerChartsHandlers();
  registerChartSessionHandlers();
  registerConfigurationHandlers();
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
