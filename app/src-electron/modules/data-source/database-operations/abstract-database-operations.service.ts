import type {
  ColumnInfo,
  DatabaseConnectionConfig,
  TableInfo,
} from './types/database-operations.types';

export abstract class AbstractDatabaseOperationsService {
  constructor(protected readonly config: DatabaseConnectionConfig) {}

  abstract testConnection(): Promise<void>;

  abstract getAllTables(schema?: string): Promise<TableInfo[]>;

  abstract getTableColumns(tableName: string, schema?: string): Promise<ColumnInfo[]>;

  abstract executeQuery<T = Record<string, unknown>>(sql: string, params?: unknown[]): Promise<T[]>;

  abstract disconnect(): Promise<void>;
}
