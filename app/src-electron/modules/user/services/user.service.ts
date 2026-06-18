import { AbstractUserService } from '@/shared/abstract-user-management/services/abstract-user.service';
import { hashPassword } from '@/shared/helpers/hash.utils';
import { UserEntity } from '../entities/user.entity';
import { UserRepository } from '../repositories/user.repository';

export class UserService extends AbstractUserService {
  constructor() {
    super(new UserRepository());
  }

  async update(id: string, dto: Partial<UserEntity>) {
    const payload = { ...dto };
    if (payload.password) {
      payload.password = await hashPassword(payload.password);
    } else {
      delete payload.password;
    }
    return super.update(id, payload);
  }
}
