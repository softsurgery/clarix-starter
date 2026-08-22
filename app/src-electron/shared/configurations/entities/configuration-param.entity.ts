import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ConfigurationNamespaceEntity } from './configuration-namespace.entity';
import { ParamVariant } from '../enums/param-variant.enum';
import { ParamViewMode } from '../enums/param-view-mode.enum';

@Entity('configuration-param')
export class ConfigurationParamEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description?: string;

  @ManyToOne(() => ConfigurationNamespaceEntity, (namespace) => namespace.params)
  @JoinColumn({ name: 'namespaceId' })
  namespace: ConfigurationNamespaceEntity;

  @Column()
  namespaceId: string;

  @Column({ type: 'simple-enum', enum: ParamVariant, default: ParamVariant.STRING })
  variant: ParamVariant;

  @Column({ type: 'simple-enum', enum: ParamViewMode, default: ParamViewMode.DEFAULT })
  viewMode: ParamViewMode;

  @Column({ type: 'varchar', length: 255, default: '' })
  value: string;

  @Column({ type: 'float', nullable: true })
  min?: number;

  @Column({ type: 'float', nullable: true })
  max?: number;

  @Column({ type: 'float', nullable: true })
  step?: number;

  @Column({ type: 'json', nullable: true })
  options?: { label: string; value: string }[];
}
