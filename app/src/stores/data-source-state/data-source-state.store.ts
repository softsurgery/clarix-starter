import { createStore, withProps } from '@ngneat/elf';
import { CreateDataSourceDto, UpdateDataSourceDto } from '@/types';
import { SelectOption } from '@/components/form-builder/form-builder.types';

export interface DataSourceStateProps {
  createDto: CreateDataSourceDto;
  updateDto: UpdateDataSourceDto;
  databaseOptions: SelectOption[];
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
  databaseOptions: [],
  errors: {},
};

export const dataSourceStateStore = createStore(
  { name: 'data-source-state' },
  withProps<DataSourceStateProps>({
    ...dataSourceInitialState,
  }),
);
