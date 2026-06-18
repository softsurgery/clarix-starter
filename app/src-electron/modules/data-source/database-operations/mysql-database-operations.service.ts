import mysql, { Connection } from 'mysql2/promise';
import { AbstractDatabaseOperationsService } from './abstract-database-operations.service';
import type { ColumnInfo, TableInfo } from './types/database-operations.types';

export class MysqlDatabaseOperationsService extends AbstractDatabaseOperationsService {
  protected connection: Connection | null = null;

  protected async getConnection(): Promise<Connection> {
    if (!this.connection) {
      this.connection = await mysql.createConnection({
        host: this.config.host,
        port: this.config.port,
        user: this.config.username,
        password: this.config.password,
        database: this.config.database,
        ssl: this.config.ssl ? { rejectUnauthorized: false } : undefined,
        connectTimeout: 10_000,
      });
    }
    return this.connection;
  }

  async testConnection(): Promise<void> {
    try {
      const connection = await this.getConnection();
      await connection.query('SELECT 1');
    } finally {
      await this.disconnect();
    }
  }

  async getAllTables(schema?: string): Promise<TableInfo[]> {
    const connection = await this.getConnection();
    const database = schema ?? this.config.database;

    if (!database) {
      throw new Error('Database name is required to list tables');
    }

    const [rows] = await connection.query(
      `SELECT TABLE_SCHEMA, TABLE_NAME
       FROM information_schema.tables
       WHERE TABLE_SCHEMA = ?
         AND TABLE_TYPE = 'BASE TABLE'
       ORDER BY TABLE_NAME`,
      [database],
    );

    return (rows as Array<{ TABLE_SCHEMA: string; TABLE_NAME: string }>).map((row) => ({
      schema: row.TABLE_SCHEMA,
      name: row.TABLE_NAME,
    }));
  }

  async getTableColumns(tableName: string, schema?: string): Promise<ColumnInfo[]> {
    const connection = await this.getConnection();
    const database = schema ?? this.config.database;

    if (!database) {
      throw new Error('Database name is required to list columns');
    }

    const [columns] = await connection.query(
      `SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT, COLUMN_KEY
       FROM information_schema.columns
       WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?
       ORDER BY ORDINAL_POSITION`,
      [database, tableName],
    );

    return (
      columns as Array<{
        COLUMN_NAME: string;
        DATA_TYPE: string;
        IS_NULLABLE: string;
        COLUMN_DEFAULT: string | null;
        COLUMN_KEY: string;
      }>
    ).map((row) => ({
      name: row.COLUMN_NAME,
      dataType: row.DATA_TYPE,
      nullable: row.IS_NULLABLE === 'YES',
      isPrimaryKey: row.COLUMN_KEY === 'PRI',
      defaultValue: row.COLUMN_DEFAULT,
    }));
  }

  async executeQuery<T = Record<string, unknown>>(
    sql: string,
    params: unknown[] = [],
  ): Promise<T[]> {
    const connection = await this.getConnection();
    const [rows] = await connection.query(sql, params);
    return rows as T[];
  }

  async disconnect(): Promise<void> {
    if (this.connection) {
      await this.connection.end().catch(() => undefined);
      this.connection = null;
    }
  }
}
