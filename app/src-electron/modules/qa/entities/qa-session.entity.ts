import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { EntityHelper } from '@/shared/database/entities/entity-helper';
import { QASessionStatus } from '../enums/qa-session-status.enum';

@Entity('qa_sessions')
export class QASessionEntity extends EntityHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 500 })
  question: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  dataSourceName?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  dataSourceId?: string;

  @Column({ type: 'simple-enum', default: QASessionStatus.PENDING })
  status: QASessionStatus;

  @Column({ type: 'text', nullable: true })
  generatedSql?: string;

  @Column({ type: 'text', nullable: true })
  answer?: string;

  @Column({ type: 'int', nullable: true })
  rowCount?: number;

  @Column({ type: 'text', nullable: true })
  error?: string;

  @Column({ type: 'int', default: 0 })
  durationMs: number;

  @Column({ type: 'text', nullable: true })
  logs?: string;
}
