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
  // ── Py ────────────────────────────────────────────────
  py: {
    sayHello: () => ipcRenderer.invoke('py:hello-cardinal'),
  },
  // ── Data Source CRUD ────────────────────────────────────
  dataSource: {
    findAll: (query?: any) => ipcRenderer.invoke('dataSource:findAll', query),
    findAllPaginated: (query?: any) => ipcRenderer.invoke('dataSource:findAllPaginated', query),
    findOneById: (id: string) => ipcRenderer.invoke('dataSource:findOneById', id),
    create: (data: any) => ipcRenderer.invoke('dataSource:create', data),
    update: (id: string, data: any) => ipcRenderer.invoke('dataSource:update', id, data),
    delete: (id: string) => ipcRenderer.invoke('dataSource:delete', id),
    testConnection: (id: string) => ipcRenderer.invoke('dataSource:testConnection', id),
  },
  // ── Agent ─────────────────────────────────────────────
  agent: {
    generate: (prompt: string) => ipcRenderer.invoke('agent:generate', prompt),
    chat: (dto: any) => ipcRenderer.invoke('agent:chat', dto),
    streamChat: (dto: any, onToken: (token: string, done: boolean) => void, onError: (err: string) => void) => {
      ipcRenderer.send('agent:chat-stream', dto);
      const listener = (_event: any, data: any) => {
        if (data.error) {
          onError(data.error);
          ipcRenderer.removeListener('agent:chat-stream-token', listener);
        } else {
          onToken(data.token, data.done);
          if (data.done) {
            ipcRenderer.removeListener('agent:chat-stream-token', listener);
          }
        }
      };
      ipcRenderer.on('agent:chat-stream-token', listener);
    },
    health: () => ipcRenderer.invoke('agent:health'),
    models: () => ipcRenderer.invoke('agent:models'),
    askDatabase: (dto: any) => ipcRenderer.invoke('agent:askDatabase', dto),
  },
});
