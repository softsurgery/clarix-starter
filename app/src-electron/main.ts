import 'reflect-metadata';
import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import { initializeDatabase } from './shared/database/database';

try {
  const envPath = path.join(app.getAppPath(), '.env');
  if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8');
    envConfig.split('\n').forEach((line) => {
      const match = line.match(/^([^=:#]+?)[=:](.*)/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim();
        if (!process.env[key]) {
          process.env[key] = value.replace(/^['"]|['"]$/g, '');
        }
      }
    });
  }
} catch (err) {
  console.warn('Could not load .env file', err);
}

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
import { runDevSeed } from './scripts/dev-seed';
import { seedUsersAndRoles } from './scripts/seed-users';

// IPC Handlers
ipcMain.handle('ping', () => 'pong');

function createWindow(): void {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
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
