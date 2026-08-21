import { createStore, withProps } from '@ngneat/elf';

export interface SettingsStateProps {
  values: Record<number, string>;
  errors: Record<string, string[]>;
}

export const settingsInitialState: SettingsStateProps = {
  values: {},
  errors: {},
};

export const settingsStateStore = createStore(
  { name: 'settings-state' },
  withProps<SettingsStateProps>({
    ...settingsInitialState,
  }),
);
