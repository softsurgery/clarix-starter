import { ChildEntity } from 'typeorm';
import { AbstractUserEntity } from '@/shared/abstract-user-management/entities/abstract-user.entity';

@ChildEntity('User')
export class UserEntity extends AbstractUserEntity {}
