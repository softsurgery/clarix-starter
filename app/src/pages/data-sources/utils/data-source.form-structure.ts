import {
  DynamicField,
  DynamicForm,
  FieldVariant,
  NumberFieldProps,
  PasswordFieldProps,
  SelectFieldProps,
  SelectOption,
  SwitchFieldProps,
  TextFieldProps,
} from '@/components/form-builder/form-builder.types';
import { DataSourceRepository } from '@/stores/data-source-state/data-source-state.repository';
import { DB_TYPE_OPTIONS, DEFAULT_PORTS } from '../data-sources.constants';
import { clearListedDatabases } from './data-source-databases';

interface DataSourceFormStructureProps {
  store: DataSourceRepository;
  mode: 'create' | 'update';
}

const toPortNumber = (value: string | number): number => {
  const port = Number(value);
  return Number.isNaN(port) || port <= 0 ? 0 : port;
};

export const getDataSourceFormStructure = ({
  store,
  mode,
}: DataSourceFormStructureProps): DynamicForm => {
  const dtoPath = mode === 'create' ? 'createDto' : 'updateDto';
  const nameField: DynamicField<TextFieldProps> = {
    id: 'name',
    label: 'Connection Name',
    variant: FieldVariant.TEXT,
    isRequired: true,
    props: {
      placeholder: 'My Production DB',
      value: store.getNestedObservable<string>(`${dtoPath}.name`),
      onChange: (value: string) => {
        store.setNested(`${dtoPath}.name`, value);
      },
    },
  };
  const typeField: DynamicField<SelectFieldProps> = {
    id: 'type',
    label: 'Database Type',
    variant: FieldVariant.SELECT,
    isRequired: true,
    props: {
      options: DB_TYPE_OPTIONS,
      placeholder: 'Select database type',
      value: store.getNestedObservable<string>(`${dtoPath}.type`),
      onSelectChange: (code: string) => {
        store.setNested(`${dtoPath}.type`, code);
        const port = DEFAULT_PORTS[code];
        store.setNested(`${dtoPath}.port`, port);
        clearListedDatabases(store, dtoPath);
      },
    },
  };
  const hostField: DynamicField<TextFieldProps> = {
    id: 'host',
    label: 'Host',
    variant: FieldVariant.TEXT,
    isRequired: true,
    props: {
      placeholder: 'localhost or 192.168.1.100',
      value: store.getNestedObservable<string>(`${dtoPath}.host`),
      onChange: (value: string) => {
        store.setNested(`${dtoPath}.host`, value);
      },
    },
  };
  const portField: DynamicField<NumberFieldProps> = {
    id: 'port',
    label: 'Port',
    variant: FieldVariant.NUMBER,
    isRequired: true,
    props: {
      placeholder: '5432',
      value: store.getNestedObservable<number>(`${dtoPath}.port`),
      onChange: (value: string | number) => {
        store.setNested(`${dtoPath}.port`, toPortNumber(value));
      },
      min: 1,
      max: 65535,
    },
  };
  const usernameField: DynamicField<TextFieldProps> = {
    id: 'username',
    label: 'Username',
    variant: FieldVariant.TEXT,
    isRequired: true,
    props: {
      placeholder: 'db_user',
      value: store.getNestedObservable<string>(`${dtoPath}.username`),
      onChange: (value: string) => {
        store.setNested(`${dtoPath}.username`, value);
      },
    },
  };

  const isUpdate = mode === 'update';

  const passwordField: DynamicField<PasswordFieldProps> = {
    id: 'password',
    label: 'Password',
    variant: FieldVariant.PASSWORD,
    isRequired: !isUpdate,
    description: isUpdate ? 'Leave blank to keep the current password' : undefined,
    props: {
      placeholder: '••••••••',
      value: store.getNestedObservable<string>(`${dtoPath}.password`),
      onChange: (value: string) => {
        store.setNested(`${dtoPath}.password`, value);
      },
    },
  };

  const defaultDatabaseField: DynamicField<SelectFieldProps> = {
    id: 'defaultDatabase',
    label: 'Default Database',
    variant: FieldVariant.SELECT,
    description: 'Test the connection to load databases from the server',
    props: {
      placeholder: 'Select a database',
      options: store.getNestedObservable<SelectOption[]>('databaseOptions'),
      value: store.getNestedObservable<string>(`${dtoPath}.defaultDatabase`),
      onSelectChange: (code: string) => {
        store.setNested(`${dtoPath}.defaultDatabase`, code);
      },
    },
  };

  const sslField: DynamicField<SwitchFieldProps> = {
    id: 'ssl',
    label: 'SSL Encryption',
    variant: FieldVariant.SWITCH,
    description: 'Enable secure SSL/TLS connection',
    props: {
      checked: store.getNestedObservable<boolean>(`${dtoPath}.ssl`),
      onCheckedChange: (value: boolean) => {
        store.setNested(`${dtoPath}.ssl`, value);
      },
    },
  };

  return {
    title: isUpdate ? 'Update Data Source' : 'New Data Source',
    description: isUpdate
      ? 'Update your database connection settings.'
      : 'Configure your database connection.',
    isHeaderHidden: true,
    grids: [
      {
        title: '',
        isHeaderHidden: true,
        gridItems: [
          {
            fields: [nameField, typeField],
          },
          {
            fields: [hostField, portField],
          },
          {
            fields: [usernameField, passwordField],
          },
          {
            fields: [defaultDatabaseField, sslField],
          },
        ],
      },
    ],
  };
};