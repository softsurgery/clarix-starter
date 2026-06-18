import { createStore, withProps } from '@ngneat/elf';
import { CreateDataSourceDto, UpdateDataSourceDto } from '@/types';

export interface DataSourceStateProps {
  createDto: CreateDataSourceDto;
  updateDto: UpdateDataSourceDto;
  errors: Record<string, string[]>;
}

export const dataSourceInitialState: DataSourceStateProps = {
  createDto: {
    name: '',
    type: 'postgresql',
    host: 'localhost',
    port: 5432,
    username: '',
    password: '',
    defaultDatabase: '',
    ssl: false,
  },
  updateDto: {
    name: '',
    type: 'postgresql',
    host: 'localhost',
    port: 5432,
    username: '',
    password: '',
    defaultDatabase: '',
    ssl: false,
    isActive: true,
  },
  errors: {},
};

export const dataSourceStateStore = createStore(
  { name: 'data-source-state' },
  withProps<DataSourceStateProps>({
    ...dataSourceInitialState,
  }),
);
