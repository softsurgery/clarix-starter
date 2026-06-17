import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { EntityHelper } from '@/shared/database/entities/entity-helper';
import { EventType } from '@/app/enums/event-type.enum';
import { AbstractUserEntity } from '@/shared/abstract-user-management/entities/abstract-user.entity';

@Entity('log')
export class LogEntity extends EntityHelper {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'simple-enum', enum: EventType, nullable: true })
  event: EventType;

  @Column({ nullable: true })
  api?: string;

  @Column({ nullable: true })
  method?: string;

  @ManyToOne(() => AbstractUserEntity, {
    nullable: true,
    eager: true,
  })
  @JoinColumn({ name: 'userId' })
  user: AbstractUserEntity;

  @Column({ nullable: true })
  userId?: string;

  @Column({ type: 'json', nullable: true })
  logInfo?: object;
}
