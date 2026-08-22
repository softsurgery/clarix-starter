import oracledb from 'oracledb';
import { AbstractDatabaseOperationsService } from './abstract-database-operations.service';
import type { ColumnInfo, TableInfo } from '../types/database-operations.types';

export class OracleDatabaseOperationsService extends AbstractDatabaseOperationsService {
  private connection: oracledb.Connection | null = null;

  private getConnectString(): string {
    const service = this.config.database;
    if (service) {
      return `${this.config.host}:${this.config.port}/${service}`;
    }
    return `${this.config.host}:${this.config.port}`;
  }

  private async getConnection(): Promise<oracledb.Connection> {
    if (!this.connection) {
      this.connection = await oracledb.getConnection({
        user: this.config.username,
        password: this.config.password,
        connectString: this.getConnectString(),
      });
    }
    return this.connection;
  }

  async testConnection(): Promise<void> {
    try {
      const connection = await this.getConnection();
      await connection.execute('SELECT 1 FROM DUAL');
    } finally {
      await this.disconnect();
    }
  }

  async listDatabases(): Promise<string[]> {
    const connection = await this.getConnection();

    try {
      const result = await connection.execute<{ NAME: string }>(
        `SELECT name
         FROM v$services
         WHERE name NOT LIKE 'SYS$%'
         ORDER BY name`,
        [],
        { outFormat: oracledb.OUT_FORMAT_OBJECT },
      );
      const names = [
        ...new Set((result.rows ?? []).map((row) => row.NAME).filter((name) => !!name)),
      ];
      if (names.length > 0) {
        return names;
      }
    } catch {
      // Insufficient privileges — fall through to the current service name.
    }

    try {
      const result = await connection.execute<{ NAME: string }>(
        `SELECT SYS_CONTEXT('USERENV', 'SERVICE_NAME') AS name FROM dual`,
        [],
        { outFormat: oracledb.OUT_FORMAT_OBJECT },
      );
      const name = result.rows?.[0]?.NAME;
      if (name) {
        return [name];
      }
    } catch {
      // Ignore and use the configured service if present.
    }

    return this.config.database ? [this.config.database] : [];
  }

  async getAllTables(schema?: string): Promise<TableInfo[]> {
    const connection = await this.getConnection();
    const owner = schema?.toUpperCase() ?? this.config.username.toUpperCase();

    const result = await connection.execute<{ OWNER: string; TABLE_NAME: string }>(
      `SELECT owner, table_name
       FROM all_tables
       WHERE owner = :owner
       ORDER BY table_name`,
      { owner },
      { outFormat: oracledb.OUT_FORMAT_OBJECT },
    );

    return (result.rows ?? []).map((row) => ({
      schema: row.OWNER,
      name: row.TABLE_NAME,
    }));
  }

  async getTableColumns(tableName: string, schema?: string): Promise<ColumnInfo[]> {
    const connection = await this.getConnection();
    const owner = schema?.toUpperCase() ?? this.config.username.toUpperCase();
    const table = tableName.toUpperCase();

    const columnsResult = await connection.execute<{
      COLUMN_NAME: string;
      DATA_TYPE: string;
      NULLABLE: string;
      DATA_DEFAULT: string | null;
    }>(
      `SELECT column_name, data_type, nullable, data_default
       FROM all_tab_columns
       WHERE owner = :owner AND table_name = :tableName
       ORDER BY column_id`,
      { owner, tableName: table },
      { outFormat: oracledb.OUT_FORMAT_OBJECT },
    );

    const pkResult = await connection.execute<{ COLUMN_NAME: string }>(
      `SELECT cols.column_name
       FROM all_constraints cons
       JOIN all_cons_columns cols
         ON cons.constraint_name = cols.constraint_name
        AND cons.owner = cols.owner
       WHERE cons.constraint_type = 'P'
         AND cons.owner = :owner
         AND cons.table_name = :tableName`,
      { owner, tableName: table },
      { outFormat: oracledb.OUT_FORMAT_OBJECT },
    );

    const primaryKeys = new Set((pkResult.rows ?? []).map((row) => row.COLUMN_NAME));

    return (columnsResult.rows ?? []).map((row) => ({
      name: row.COLUMN_NAME,
      dataType: row.DATA_TYPE,
      nullable: row.NULLABLE === 'Y',
      isPrimaryKey: primaryKeys.has(row.COLUMN_NAME),
      defaultValue: row.DATA_DEFAULT,
    }));
  }

  async executeQuery<T = Record<string, unknown>>(
    sql: string,
    params: oracledb.BindParameters = [],
  ): Promise<T[]> {
    const connection = await this.getConnection();
    const result = await connection.execute(sql, params, { outFormat: oracledb.OUT_FORMAT_OBJECT });
    return (result.rows ?? []) as T[];
  }

  async disconnect(): Promise<void> {
    if (this.connection) {
      await this.connection.close().catch(() => undefined);
      this.connection = null;
    }
  }
}
