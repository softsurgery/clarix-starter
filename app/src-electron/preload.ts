import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  /** Returns platform info from the main process */
  getPlatform: (): string => process.platform,

  /** Returns the Electron version */
  getElectronVersion: (): string => process.versions.electron,

  /** Returns the Node.js version */
  getNodeVersion: (): string => process.versions.node,

  /** Returns the Chrome version */
  getChromeVersion: (): string => process.versions.chrome,

  /** Send a ping and get a pong from main process */
  ping: (): Promise<string> => ipcRenderer.invoke('ping'),

 
  // ── Storage ─────────────────────────────────────────
  storage: {
    store: (file: any) => ipcRenderer.invoke('storage:store', file),
    findOneById: (id: number) => ipcRenderer.invoke('storage:findOneById', id),
    getFilePath: (id: number) => ipcRenderer.invoke('storage:getFilePath', id),
    delete: (id: number) => ipcRenderer.invoke('storage:softDelete', id),
  },
  // ── Auth ────────────────────────────────────────────────
  auth: {
    login: (credentials: { usernameOrEmail: string; password: string }) =>
      ipcRenderer.invoke('auth:login', credentials),
  },
  // ── User CRUD ─────────────────────────────────────────
  user: {
    findAll: (query?: any) => ipcRenderer.invoke('user:findAll', query),
    findAllPaginated: (query?: any) => ipcRenderer.invoke('user:findAllPaginated', query),
    findOneById: (id: string) => ipcRenderer.invoke('user:findOneById', id),
    create: (data: any) => ipcRenderer.invoke('user:create', data),
    update: (id: string, data: any) => ipcRenderer.invoke('user:update', id, data),
    delete: (id: string) => ipcRenderer.invoke('user:delete', id),
  },
  // ── Role CRUD ─────────────────────────────────────────
  role: {
    findAll: (query?: any) => ipcRenderer.invoke('role:findAll', query),
    findAllPaginated: (query?: any) => ipcRenderer.invoke('role:findAllPaginated', query),
    findOneById: (id: string) => ipcRenderer.invoke('role:findOneById', id),
    create: (data: any) => ipcRenderer.invoke('role:create', data),
    update: (id: string, data: any) => ipcRenderer.invoke('role:update', id, data),
    delete: (id: string) => ipcRenderer.invoke('role:delete', id),
  },
});
