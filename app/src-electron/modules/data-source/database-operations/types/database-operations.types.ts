export interface DatabaseConnectionConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database?: string;
  ssl?: boolean;
}

export interface TableInfo {
  schema: string;
  name: string;
}

export interface ColumnInfo {
  name: string;
  dataType: string;
  nullable: boolean;
  isPrimaryKey: boolean;
  defaultValue: string | null;
}
