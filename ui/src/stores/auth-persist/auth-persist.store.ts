import { createStore, withProps } from '@ngneat/elf';
import { persistState, localStorageStrategy } from '@ngneat/elf-persist-state';

export interface AuthPersistProps {
  authenticated?: boolean;
}

export const authPersistInitialState: AuthPersistProps = {
  authenticated: false,
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
