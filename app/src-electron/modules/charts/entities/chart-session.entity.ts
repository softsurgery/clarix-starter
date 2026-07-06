import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { EntityHelper } from '@/shared/database/entities/entity-helper';
import { ChartSessionStatus } from '../enums/chart-session-status.enum';

@Entity('chart_sessions')
export class ChartSessionEntity extends EntityHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 500 })
  question: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  dataSourceName?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  dataSourceId?: string;

  @Column({ type: 'simple-enum', default: ChartSessionStatus.PENDING })
  status: ChartSessionStatus;

  @Column({ type: 'varchar', length: 255, nullable: true })
  title?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'int', nullable: true })
  chartCount?: number;

  @Column({ type: 'text', nullable: true })
  chartsPayload?: string;

  @Column({ type: 'text', nullable: true })
  error?: string;

  @Column({ type: 'int', default: 0 })
  durationMs: number;

  @Column({ type: 'text', nullable: true })
  logs?: string;
}
