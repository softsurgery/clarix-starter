import { createStore, withProps } from '@ngneat/elf';

export interface ConfigurationsStateProps {
  values: Record<number, string>;
  errors: Record<string, string[]>;
}

export const configurationsInitialState: ConfigurationsStateProps = {
  values: {},
  errors: {},
};

export const configurationsStateStore = createStore(
  { name: 'configurations-state' },
  withProps<ConfigurationsStateProps>({
    ...configurationsInitialState,
  }),
);
