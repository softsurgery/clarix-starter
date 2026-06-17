# AGENTS.md — Clarix

Guidance for AI agents working in this repository. See [docs/PLANNING.md](docs/PLANNING.md) for the full project roadmap.

## Stack

- **Renderer:** Angular 21, Spartan-ng, Tailwind CSS 4, `@ngneat/elf`
- **Main process:** Electron 40, TypeORM, SQLite (`better-sqlite3`), bcrypt
- **IPC:** `contextBridge` in preload → `ipcMain.handle` in main process

## Key entry points

| File                                       | Role                                            |
| ------------------------------------------ | ----------------------------------------------- |
| `src-electron/main.ts`                     | Bootstrap, register IPC handlers, create window |
| `src-electron/preload.ts`                  | Expose `window.electronAPI` to renderer         |
| `src-electron/shared/database/database.ts` | SQLite init, entity list                        |
| `src/app/app.routes.ts`                    | Angular routes                                  |
| `src/types/electron.d.ts`                  | Preload API types                               |

## Conventions

### Backend modules (`src-electron/modules/<domain>/`)

```
entities/ → repositories/ → services/ → ipcs/
```

- Entities extend `EntityHelper` (timestamps, soft delete)
- Services extend `AbstractCrudService`
- IPC handlers follow naming: `<domain>:<action>` (e.g. `order:pay`, `table:create`)
- Register new handlers in `main.ts`; expose in `preload.ts`; add types to `electron.d.ts`

### Frontend pages (`src/pages/<feature>/`)

- Local `*.service.ts` wraps `window.electronAPI` with RxJS `from(...)`
- Reuse `form-builder`, `datatable-builder`, `sheet`, and `dialog` components
- Elf stores hold form DTO state and auth persistence — not a full entity cache

### Decorators

`@Injectable()` from `@nestjs/common` appears in Electron code for consistency but this is **not** a NestJS app. No DI container — services are instantiated directly in IPC handlers.

## Do

- Match existing naming, file structure, and patterns in the module you are editing
- Add IPC handlers to all three layers: handler file, `main.ts`, `preload.ts`, `electron.d.ts`
- Use soft delete via `EntityHelper` / `softDelete()` unless hard delete is explicitly required
- Keep changes scoped — one concern per PR

## Do not

- Add entities with `synchronize: true` without a migration plan (see Phase 6 in PLANNING.md)
- Register IPC handlers with channel names that collide with existing domains
- Put business logic in IPC handler files — keep handlers thin, delegate to services
- Commit secrets (`.env`, credentials, API keys)
- Use `nodeIntegration: true` or disable `contextIsolation`

## Known pitfalls

## Dev commands

```bash
npm run electron:dev   # Start dev (Angular + Electron)
npm test               # Vitest
npm run build          # Production build
```
