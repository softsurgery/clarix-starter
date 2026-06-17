import { createStore, withProps } from '@ngneat/elf';
import { CreateRoleDto, UpdateRoleDto } from '@/types';

export interface RoleStateProps {
  createDto: CreateRoleDto;
  updateDto: UpdateRoleDto;
  errors: Record<string, string[]>;
}

export const roleInitialState: RoleStateProps = {
  createDto: {
    label: '',
    description: '',
  },
  updateDto: {
    label: '',
    description: '',
  },
  errors: {},
};

export const roleStateStore = createStore(
  { name: 'role-state' },
  withProps<RoleStateProps>({
    ...roleInitialState,
  }),
);
