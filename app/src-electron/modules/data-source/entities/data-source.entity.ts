import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { EntityHelper } from '@/shared/database/entities/entity-helper';
import { DataSourceType } from '../enums/data-source-type.enm';

@Entity('data_sources')
export class DataSourceEntity extends EntityHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'simple-enum', length: 50 })
  type: DataSourceType;

  @Column({ type: 'varchar', length: 255 })
  host: string;

  @Column({ type: 'int' })
  port: number;

  @Column({ type: 'varchar', length: 255 })
  username: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  defaultDatabase?: string;

  @Column({ type: 'boolean', default: false })
  ssl?: boolean;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;
}
