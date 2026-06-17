import { DatabaseAbstractRepository } from '@/shared/database/repositories/database.repository';
import { Injectable } from '@nestjs/common';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { AbstractUserEntity } from '../entities/abstract-user.entity';
import { AbstractCrudService } from '@/shared/database/services/abstract-crud.service';
import { hashPassword } from '@/shared/helpers/hash.utils';

@Injectable()
export abstract class AbstractUserService extends AbstractCrudService<AbstractUserEntity> {
  private abstractUserRepository: DatabaseAbstractRepository<AbstractUserEntity>;
  constructor(abstractUserRepository: DatabaseAbstractRepository<AbstractUserEntity>) {
    super(abstractUserRepository);
    this.abstractUserRepository = abstractUserRepository;
  }

  async save(createUserDto: Partial<AbstractUserEntity>): Promise<AbstractUserEntity> {
    const hashedPassword = createUserDto.password && (await hashPassword(createUserDto.password));
    createUserDto.password = hashedPassword;
    return this.abstractUserRepository.save(createUserDto);
  }

  //Extended Methods ===========================================================================

  async findOneByUsernameOrEmail(
    usernameOrEmail: string,
  ): Promise<AbstractUserEntity | null | undefined> {
    return this.abstractUserRepository.findOne({
      where: [{ email: usernameOrEmail }, { username: usernameOrEmail }],
    });
  }

  async findOneByEmail(email: string): Promise<AbstractUserEntity | null | undefined> {
    return this.abstractUserRepository.findOne({
      where: { email },
    });
  }

  async findOneByUsername(username: string): Promise<AbstractUserEntity | null | undefined> {
    return this.abstractUserRepository.findOne({
      where: { username },
    });
  }

  async activate(id: string): Promise<AbstractUserEntity | null | undefined> {
    return this.abstractUserRepository.update(id, { isActive: true });
  }

  async deactivate(id: string): Promise<AbstractUserEntity | null | undefined> {
    return this.abstractUserRepository.update(id, {
      isActive: false,
    });
  }

  async approve(id: string): Promise<AbstractUserEntity | null | undefined> {
    return this.abstractUserRepository.update(id, {
      isApproved: true,
    });
  }

  async disapprove(id: string): Promise<AbstractUserEntity | null | undefined> {
    return this.abstractUserRepository.update(id, {
      isApproved: false,
    });
  }

  async changePassword(
    id: string,
    password: string,
  ): Promise<AbstractUserEntity | null | undefined> {
    const user = await this.findOneById(id);
    const hashedPassword = await hashPassword(password);
    return this.abstractUserRepository.update(id, {
      ...user,
      password: hashedPassword,
    });
  }
}
