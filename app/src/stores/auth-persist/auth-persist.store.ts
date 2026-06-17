import { createStore, withProps } from '@ngneat/elf';
import { persistState, localStorageStrategy } from '@ngneat/elf-persist-state';
import { AuthUserDto } from '@/types';

export interface AuthPersistProps {
  authenticated?: boolean;
  user?: AuthUserDto | null;
}

export const authPersistInitialState: AuthPersistProps = {
  authenticated: false,
  user: null,
};

export const authPersistStore = createStore(
  { name: 'auth-persist-state' },
  withProps<AuthPersistProps>({
    ...authPersistInitialState,
  }),
);

// persist to localStorage
persistState(authPersistStore, {
  key: 'auth-persist-state',
  storage: localStorageStrategy,
});
