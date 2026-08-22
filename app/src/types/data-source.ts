export type DataSourceType = 'postgresql' | 'mysql' | 'mariadb' | 'oracle';

export interface CreateDataSourceDto {
  name: string;
  type: DataSourceType;
  host: string;
  port: number;
  username: string;
  password: string;
  defaultDatabase?: string;
  ssl: boolean;
}

export interface UpdateDataSourceDto extends Partial<CreateDataSourceDto> {
  isActive?: boolean;
}

export interface ResponseDataSourceDto {
  id: string;
  name: string;
  type: DataSourceType;
  host: string;
  port: number;
  username: string;
  password: string;
  defaultDatabase?: string;
  ssl: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TestConnectionResult {
  success: boolean;
  message: string;
  isActive: boolean;
}

export interface ListDatabasesDto {
  id?: string;
  type?: DataSourceType;
  host?: string;
  port?: number;
  username?: string;
  password?: string;
  ssl?: boolean;
  defaultDatabase?: string;
}

export interface ListDatabasesResult {
  success: boolean;
  databases: string[];
  message?: string;
}
