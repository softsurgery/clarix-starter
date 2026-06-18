import { Client } from 'pg';
import { AbstractDatabaseOperationsService } from './abstract-database-operations.service';
import type { ColumnInfo, TableInfo } from './types/database-operations.types';

export class PostgresqlDatabaseOperationsService extends AbstractDatabaseOperationsService {
  private client: Client | null = null;

  private getClient(): Client {
    if (!this.client) {
      this.client = new Client({
        host: this.config.host,
        port: this.config.port,
        user: this.config.username,
        password: this.config.password,
        database: this.config.database || 'postgres',
        ssl: this.config.ssl ? { rejectUnauthorized: false } : undefined,
        connectionTimeoutMillis: 10_000,
      });
    }
    return this.client;
  }

  async testConnection(): Promise<void> {
    const client = this.getClient();
    try {
      await client.connect();
      await client.query('SELECT 1');
    } finally {
      await this.disconnect();
    }
  }

  async getAllTables(schema = 'public'): Promise<TableInfo[]> {
    const client = this.getClient();
    await client.connect();

    const result = await client.query<{ table_schema: string; table_name: string }>(
      `SELECT table_schema, table_name
       FROM information_schema.tables
       WHERE table_schema = $1
         AND table_type = 'BASE TABLE'
       ORDER BY table_name`,
      [schema],
    );

    return result.rows.map((row) => ({
      schema: row.table_schema,
      name: row.table_name,
    }));
  }

  async getTableColumns(tableName: string, schema = 'public'): Promise<ColumnInfo[]> {
    const client = this.getClient();
    await client.connect();

    const columnsResult = await client.query<{
      column_name: string;
      data_type: string;
      is_nullable: string;
      column_default: string | null;
    }>(
      `SELECT column_name, data_type, is_nullable, column_default
       FROM information_schema.columns
       WHERE table_schema = $1 AND table_name = $2
       ORDER BY ordinal_position`,
      [schema, tableName],
    );

    const pkResult = await client.query<{ column_name: string }>(
      `SELECT kcu.column_name
       FROM information_schema.table_constraints tc
       JOIN information_schema.key_column_usage kcu
         ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
       WHERE tc.constraint_type = 'PRIMARY KEY'
         AND tc.table_schema = $1
         AND tc.table_name = $2`,
      [schema, tableName],
    );

    const primaryKeys = new Set(pkResult.rows.map((row) => row.column_name));

    return columnsResult.rows.map((row) => ({
      name: row.column_name,
      dataType: row.data_type,
      nullable: row.is_nullable === 'YES',
      isPrimaryKey: primaryKeys.has(row.column_name),
      defaultValue: row.column_default,
    }));
  }

  async executeQuery<T = Record<string, unknown>>(
    sql: string,
    params: unknown[] = [],
  ): Promise<T[]> {
    const client = this.getClient();
    await client.connect();
    const result = await client.query(sql, params);
    return result.rows as T[];
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.end().catch(() => undefined);
      this.client = null;
    }
  }
}
