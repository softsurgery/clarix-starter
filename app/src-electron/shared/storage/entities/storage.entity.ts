import { EntityHelper } from '@/shared/database/entities/entity-helper';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('storage')
export class StorageEntity extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({})
  slug: string;

  @Column({})
  filename: string;

  @Column({})
  relativePath: string;

  @Column({})
  mimetype: string;

  @Column({})
  size: number;

  @Column({ default: false })
  isTemporary: boolean;

  @Column({ default: true })
  isPrivate: boolean;
}
