/**
 * Type definitions for the Electron preload API exposed via contextBridge.
 * This allows the Angular app to use `window.electronAPI` with full type safety.
 */

import { CreateOrderDto, ResponseOrderDto, UpdateOrderDto } from './order.types';
import { ResponseProductDto, UpdateProductDto } from './product';
import { CreateProductFamilyDto, ResponseProductFamilyDto } from './product.family';
import { CreateTableDto, ResponseTableDto } from './table.types';
import { ResponseTableZoneDto } from './table-zone.types';
import { StorageFileData, StorageResponse } from '../services/storage.service';
import type { FindManyQueryDto } from './find-many-query.types';
import type {
  AuthUserDto,
  CreateUserDto,
  LoginCredentials,
  ResponseUserDto,
  UpdateUserDto,
} from './user.types';
import type { CreateRoleDto, ResponseRoleDto, UpdateRoleDto } from './role.types';
import type {
  CreateDataSourceDto,
  ResponseDataSourceDto,
  UpdateDataSourceDto,
} from './data-source';

export interface PaginatedMeta {
  page: number;
  take: number;
  itemCount: number;
  pageCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginatedMeta;
}

export interface TableAPI {
  findAll(query?: FindManyQueryDto): Promise<ResponseTableDto[]>;
  findAllPaginated(query?: FindManyQueryDto): Promise<PaginatedResponse<ResponseTableDto>>;
  findOneById(id: number): Promise<ResponseTableDto | null>;
  create(data: CreateTableDto): Promise<ResponseTableDto>;
  update(
    id: number,
    data: Partial<{ name: string; zoneId: number; status: string }>,
  ): Promise<ResponseTableDto | null>;
  delete(id: number): Promise<ResponseTableDto>;
}

export interface TableZoneAPI {
  findAll(query?: FindManyQueryDto): Promise<ResponseTableZoneDto[]>;
  findAllPaginated(query?: FindManyQueryDto): Promise<PaginatedResponse<ResponseTableZoneDto>>;
  findOneById(id: number): Promise<ResponseTableZoneDto | null>;
  create(data: { name: string }): Promise<ResponseTableZoneDto>;
  update(id: number, data: Partial<{ name: string }>): Promise<ResponseTableZoneDto | null>;
  delete(id: number): Promise<ResponseTableZoneDto>;
}

export interface OrderAPI {
  findAll(query?: FindManyQueryDto): Promise<ResponseOrderDto[]>;
  findAllPaginated(query?: FindManyQueryDto): Promise<PaginatedResponse<ResponseOrderDto>>;
  findOneById(id: number): Promise<ResponseOrderDto | null>;
  create(data: CreateOrderDto): Promise<ResponseOrderDto>;
  update(id: number, data: Partial<UpdateOrderDto>): Promise<ResponseOrderDto | null>;
  delete(id: number): Promise<ResponseOrderDto>;
  pay(id: number, amount: number): Promise<ResponseOrderDto>;
}

export interface ProductFamilyAPI {
  findAll(query?: FindManyQueryDto): Promise<ResponseProductFamilyDto[]>;
  findAllPaginated(query?: FindManyQueryDto): Promise<PaginatedResponse<ResponseProductFamilyDto>>;
  findOneById(id: number): Promise<ResponseProductFamilyDto | null>;
  create(data: CreateProductFamilyDto): Promise<ResponseProductFamilyDto>;
  update(
    id: number,
    data: Partial<UpdateProductFamilyDto>,
  ): Promise<ResponseProductFamilyDto | null>;
  delete(id: number): Promise<ResponseProductFamilyDto>;
}

export interface ProductAPI {
  findAll(query?: FindManyQueryDto): Promise<ResponseProductDto[]>;
  findAllPaginated(query?: FindManyQueryDto): Promise<PaginatedResponse<ResponseProductDto>>;
  findOneById(id: number): Promise<ResponseProductDto | null>;
  create(data: CreateProductDto): Promise<ResponseProductDto>;
  update(id: number, data: Partial<UpdateProductDto>): Promise<ResponseProductDto | null>;
  delete(id: number): Promise<ResponseProductDto>;
}

export interface StorageAPI {
  store(file: StorageFileData): Promise<StorageResponse>;
  findOneById(id: number): Promise<StorageResponse>;
  getFilePath(id: number): Promise<string>;
  delete(id: number): Promise<StorageResponse>;
}

export interface AuthAPI {
  login(credentials: LoginCredentials): Promise<AuthUserDto | null>;
}

export interface UserAPI {
  findAll(query?: FindManyQueryDto): Promise<ResponseUserDto[]>;
  findAllPaginated(query?: FindManyQueryDto): Promise<PaginatedResponse<ResponseUserDto>>;
  findOneById(id: string): Promise<ResponseUserDto | null>;
  create(data: CreateUserDto): Promise<ResponseUserDto>;
  update(id: string, data: UpdateUserDto): Promise<ResponseUserDto | null>;
  delete(id: string): Promise<ResponseUserDto>;
}

export interface RoleAPI {
  findAll(query?: FindManyQueryDto): Promise<ResponseRoleDto[]>;
  findAllPaginated(query?: FindManyQueryDto): Promise<PaginatedResponse<ResponseRoleDto>>;
  findOneById(id: string): Promise<ResponseRoleDto | null>;
  create(data: CreateRoleDto): Promise<ResponseRoleDto>;
  update(id: string, data: UpdateRoleDto): Promise<ResponseRoleDto | null>;
  delete(id: string): Promise<ResponseRoleDto>;
}

export interface PyAPI {
  sayHello(): Promise<{ message: string; output?: string; error?: string }>;
}

export interface DataSourceAPI {
  findAll(query?: FindManyQueryDto): Promise<ResponseDataSourceDto[]>;
  findAllPaginated(query?: FindManyQueryDto): Promise<PaginatedResponse<ResponseDataSourceDto>>;
  findOneById(id: string): Promise<ResponseDataSourceDto | null>;
  create(data: CreateDataSourceDto): Promise<ResponseDataSourceDto>;
  update(id: string, data: UpdateDataSourceDto): Promise<ResponseDataSourceDto | null>;
  delete(id: string): Promise<ResponseDataSourceDto>;
  testConnection(id: string): Promise<{ success: boolean; message: string }>;
}

export interface AgentAPI {
  generate(prompt: string, option: OllamaGenerateOptions): Promise<{ response: string }>;
  chat(dto: any): Promise<{ message: any }>;
  streamChat(
    dto: any,
    onToken: (token: string, done: boolean) => void,
    onError: (err: string) => void,
  ): void;
  health(): Promise<{ available: boolean }>;
  models(): Promise<{ models: string[] }>;
}

export interface ElectronAPI {
  /** Returns the OS platform (e.g., 'linux', 'win32', 'darwin') */
  getPlatform(): string;
  /** Returns the Electron version */
  getElectronVersion(): string;
  /** Returns the Node.js version */
  getNodeVersion(): string;
  /** Returns the Chrome version */
  getChromeVersion(): string;
  /** Send a ping and get a pong from main process */
  ping(): Promise<string>;
  /** Table CRUD operations */
  table: TableAPI;
  /** Table Zone CRUD operations */
  tableZone: TableZoneAPI;
  /** Order CRUD operations */
  order: OrderAPI;
  /** Product Family CRUD operations */
  productFamily: ProductFamilyAPI;
  /** Product CRUD operations */
  product: ProductAPI;
  /** Storage operations */
  storage: StorageAPI;
  /** Authentication */
  auth: AuthAPI;
  /** User CRUD operations */
  user: UserAPI;
  /** Role CRUD operations */
  role: RoleAPI;
  /** Python runner */
  py: PyAPI;
  /** Agent interactions */
  agent: AgentAPI;
  /** Data Source CRUD operations */
  dataSource: DataSourceAPI;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}
