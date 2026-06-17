import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  TableInheritance,
} from 'typeorm';
import { RoleEntity } from './role.entity';
import { EntityHelper } from '@/shared/database/entities/entity-helper';

@Entity('users')
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export abstract class AbstractUserEntity extends EntityHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  firstName?: string;

  @Column({ nullable: true })
  lastName?: string;

  @Column({ type: 'datetime', nullable: true })
  dateOfBirth?: Date;

  @Column({ default: false })
  isActive: boolean;

  @Column({ default: false })
  isApproved: boolean;

  @Column({ nullable: true })
  password?: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'datetime', nullable: true })
  emailVerified?: Date;

  @Column({ nullable: true })
  image?: string;

  @ManyToOne(() => RoleEntity, (role) => role.users, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'roleId' })
  role: RoleEntity;

  @Column({})
  roleId: string;
}
