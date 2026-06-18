import { getDataSource } from '../shared/database/database';
import { RoleEntity } from '../shared/abstract-user-management/entities/role.entity';
import { BasicRoles } from '../shared/abstract-user-management/enums/basic-roles.enum';
import { hashPassword } from '../shared/helpers/hash.utils';
import { UserEntity } from '../modules/user/entities/user.entity';

export async function seedUsersAndRoles(): Promise<void> {
  const dataSource = getDataSource();
  const roleRepo = dataSource.getRepository(RoleEntity);
  const userRepo = dataSource.getRepository(UserEntity);

  const existingRoles = await roleRepo.count();
  if (existingRoles > 0) {
    console.log('[Seed] Users/Roles already seeded. Skipping.');
    return;
  }

  console.log('[Seed] Seeding roles and admin user...');

  const adminRole = await roleRepo.save({
    label: BasicRoles.Admin,
    description: 'Full system access',
  });

  await roleRepo.save({
    label: BasicRoles.User,
    description: 'Standard clarix access',
  });

  const hashedPassword = await hashPassword('admin');
  await userRepo.save({
    username: 'admin',
    email: 'admin@example.com',
    password: hashedPassword,
    firstName: 'Admin',
    lastName: 'User',
    isActive: true,
    isApproved: true,
    roleId: adminRole.id,
  });

  console.log('[Seed] Users/Roles seeding complete.');
}
