import { Injectable } from '@nestjs/common';
import { DeepPartial } from 'typeorm';
import { RolePermissionService } from './role-permission.service';
import { UpdateRoleDto } from '../dtos/role/update-role.dto';
import { RolePermissionEntity } from '../entities/role-permission.entity';
import { CreateRolePermissionDto } from '../dtos/role-permission/create-role-permission.dto';
import { RoleEntity } from '../entities/role.entity';
import { RoleRepository } from '../repositories/role.repository';
import { AbstractCrudService } from '@/shared/database/services/abstract-crud.service';

@Injectable()
export class RoleService extends AbstractCrudService<RoleEntity> {
  private readonly roleRepository: RoleRepository;
  private readonly rolePermissionService: RolePermissionService;

  constructor() {
    const roleRepository = new RoleRepository();
    super(roleRepository);
    this.roleRepository = roleRepository;
    this.rolePermissionService = new RolePermissionService();
  }

  async saveWithPermissions(createRoleDto: DeepPartial<RoleEntity>): Promise<RoleEntity> {
    const { permissions, ...rest } = createRoleDto;
    const existingRole = await this.roleRepository.findOne({
      where: { label: createRoleDto.label },
    });
    if (existingRole) {
      throw new Error('Role with this label already exists');
    }
    const role = await this.roleRepository.save(rest);
    await this.rolePermissionService.saveMany(
      permissions?.map((p) => ({
        roleId: role.id,
        permissionId: p.permissionId,
      })) || [],
    );
    return role;
  }

  async saveManyWithPermissions(createRoleDtos: DeepPartial<RoleEntity>[]): Promise<RoleEntity[]> {
    return Promise.all(createRoleDtos.map((dto) => this.saveWithPermissions(dto)));
  }

  async updateWithPermissions(
    id: string,
    updateRoleDto: UpdateRoleDto,
  ): Promise<RoleEntity | null> {
    const { permissions, ...rest } = updateRoleDto;
    const existingRole = await this.roleRepository.findOneById(id);
    if (!existingRole) throw new Error('Role not found');

    await this.roleRepository.update(id, rest);

    const updatedRole = await this.roleRepository.findOne({
      where: { id },
      relations: ['permissions'],
    });

    if (!updatedRole) throw new Error('Role not found');

    const existingPermissions = updatedRole?.permissions?.map((p: RolePermissionEntity) => {
      return {
        id: p.id,
        permissionId: p.permissionId,
        roleId: p.roleId,
      };
    });

    await this.roleRepository.updateAssociations<
      Pick<RolePermissionEntity, 'id' | 'permissionId' | 'roleId'>
    >({
      existingItems: existingPermissions || [],
      updatedItems: permissions?.map((permission) => ({
        id: permission.id,
        permissionId: permission.permissionId,
        roleId: updatedRole?.id,
      })),
      keys: ['permissionId', 'roleId'],
      onDelete: async (id) => {
        return this.rolePermissionService.softDelete(id);
      },
      onCreate: async (p: CreateRolePermissionDto) => {
        return this.rolePermissionService.save({
          roleId: updatedRole?.id,
          permissionId: p.permissionId,
        });
      },
    });

    return updatedRole;
  }

  async duplicateWithPermissions(id: string): Promise<RoleEntity | null> {
    const role = await this.roleRepository.findOne({
      where: { id },
      relations: ['permissions'],
    });
    if (!role) {
      throw new Error('Role not found');
    }
    return this.saveWithPermissions({
      label: `${role.label} copy`,
      description: role.description,
      permissions: role.permissions.map((p) => ({
        permissionId: p.permissionId,
      })),
    });
  }
}
