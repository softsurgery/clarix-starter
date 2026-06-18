import {
  DynamicField,
  DynamicForm,
  FieldVariant,
  NumberFieldProps,
  PasswordFieldProps,
  SelectFieldProps,
  SwitchFieldProps,
  TextFieldProps,
} from '@/components/form-builder/form-builder.types';
import { DataSourceRepository } from '@/stores/data-source-state/data-source-state.repository';
import { DB_TYPE_OPTIONS, DEFAULT_PORTS } from '../../data-sources.constants';

interface DataSourceCreateFormStructureProps {
  store: DataSourceRepository;
}

export const getDataSourceCreateFormStructure = ({
  store,
}: DataSourceCreateFormStructureProps): DynamicForm => {
  const nameField: DynamicField<TextFieldProps> = {
    id: 'name',
    label: 'Connection Name',
    variant: FieldVariant.TEXT,
    isRequired: true,
    props: {
      placeholder: 'My Production DB',
      value: store.getNestedObservable<string>('createDto.name'),
      onChange: (value: string) => {
        store.setNested('createDto.name', value);
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
      value: store.getNestedObservable<string>('createDto.type'),
      onSelectChange: (code: string) => {
        store.setNested('createDto.type', code);
        const port = DEFAULT_PORTS[code];
        store.setNested('createDto.port', port);
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
      value: store.getNestedObservable<string>('createDto.host'),
      onChange: (value: string) => {
        store.setNested('createDto.host', value);
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
      value: store.getNestedObservable<number>('createDto.port'),
      onChange: (value: number) => {
        store.setNested('createDto.port', value);
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
      value: store.getNestedObservable<string>('createDto.username'),
      onChange: (value: string) => {
        store.setNested('createDto.username', value);
      },
    },
  };

  const passwordField: DynamicField<PasswordFieldProps> = {
    id: 'password',
    label: 'Password',
    variant: FieldVariant.PASSWORD,
    isRequired: true,
    props: {
      placeholder: '••••••••',
      value: store.getNestedObservable<string>('createDto.password'),
      onChange: (value: string) => {
        store.setNested('createDto.password', value);
      },
    },
  };

  const defaultDatabaseField: DynamicField<TextFieldProps> = {
    id: 'defaultDatabase',
    label: 'Default Database',
    variant: FieldVariant.TEXT,
    description: 'The database to connect to by default',
    props: {
      placeholder: 'my_database',
      value: store.getNestedObservable<string>('createDto.defaultDatabase'),
      onChange: (value: string) => {
        store.setNested('createDto.defaultDatabase', value);
      },
    },
  };

  const sslField: DynamicField<SwitchFieldProps> = {
    id: 'ssl',
    label: 'SSL Encryption',
    variant: FieldVariant.SWITCH,
    description: 'Enable secure SSL/TLS connection',
    props: {
      checked: store.getNestedObservable<boolean>('createDto.ssl'),
      onCheckedChange: (value: boolean) => {
        store.setNested('createDto.ssl', value);
      },
    },
  };

  return {
    title: 'New Data Source',
    description: 'Configure your database connection.',
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
