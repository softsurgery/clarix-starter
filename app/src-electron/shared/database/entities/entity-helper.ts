import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from 'typeorm';
import {
  DATABASE_CREATED_AT_FIELD_NAME,
  DATABASE_DELETED_AT_FIELD_NAME,
  DATABASE_RESTRICT_DELETE_FIELD_NAME,
  DATABASE_UPDATED_AT_FIELD_NAME,
} from '../constants/database.constant';

export class EntityHelper extends BaseEntity {
  @CreateDateColumn()
  [DATABASE_CREATED_AT_FIELD_NAME]?: Date;

  @UpdateDateColumn()
  [DATABASE_UPDATED_AT_FIELD_NAME]?: Date;

  @DeleteDateColumn()
  [DATABASE_DELETED_AT_FIELD_NAME]?: Date;

  @Column({ type: 'boolean', default: false })
  [DATABASE_RESTRICT_DELETE_FIELD_NAME]?: boolean;
}
