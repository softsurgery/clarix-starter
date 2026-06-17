import { createStore, withProps } from '@ngneat/elf';
import { CreateUserDto, UpdateUserDto } from '@/types';

export interface UserStateProps {
  createDto: CreateUserDto;
  updateDto: UpdateUserDto;
  errors: Record<string, string[]>;
}

export const userInitialState: UserStateProps = {
  createDto: {
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    roleId: '',
  },
  updateDto: {
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    roleId: '',
    isActive: true,
  },
  errors: {},
};

export const userStateStore = createStore(
  { name: 'user-state' },
  withProps<UserStateProps>({
    ...userInitialState,
  }),
);
