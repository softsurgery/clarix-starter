import { DataSourceType } from '../../modules/data-source/enums/data-source-type.enm';
import { AbstractDatabaseOperationsService } from './services/abstract-database-operations.service';
import { MariadbDatabaseOperationsService } from './services/mariadb-database-operations.service';
import { MysqlDatabaseOperationsService } from './services/mysql-database-operations.service';
import { OracleDatabaseOperationsService } from './services/oracle-database-operations.service';
import { PostgresqlDatabaseOperationsService } from './services/postgresql-database-operations.service';
import type { DatabaseConnectionConfig } from './types/database-operations.types';

export function createDatabaseOperationsService(
  type: DataSourceType,
  config: DatabaseConnectionConfig,
): AbstractDatabaseOperationsService {
  switch (type) {
    case DataSourceType.POSTGRESQL:
      return new PostgresqlDatabaseOperationsService(config);
    case DataSourceType.MYSQL:
      return new MysqlDatabaseOperationsService(config);
    case DataSourceType.MARIADB:
      return new MariadbDatabaseOperationsService(config);
    case DataSourceType.ORACLE:
      return new OracleDatabaseOperationsService(config);
    default:
      throw new Error(`Unsupported database type: ${type}`);
  }
}

export function toConnectionConfig(entity: {
  host: string;
  port: number;
  username: string;
  password: string;
  defaultDatabase?: string;
  ssl?: boolean;
}): DatabaseConnectionConfig {
  return {
    host: entity.host,
    port: entity.port,
    username: entity.username,
    password: entity.password,
    database: entity.defaultDatabase,
    ssl: entity.ssl,
  };
}
