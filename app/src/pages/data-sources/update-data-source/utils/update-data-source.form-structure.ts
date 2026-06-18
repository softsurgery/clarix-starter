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

interface DataSourceUpdateFormStructureProps {
  store: DataSourceRepository;
}
export const getDataSourceUpdateFormStructure = ({
  store,
}: DataSourceUpdateFormStructureProps): DynamicForm => {
  const nameField: DynamicField<TextFieldProps> = {
    id: 'name',
    label: 'Connection Name',
    variant: FieldVariant.TEXT,
    isRequired: true,
    props: {
      placeholder: 'My Production DB',
      value: store.getNestedObservable<string>('updateDto.name'),
      onChange: (value: string) => {
        store.setNested('updateDto.name', value);
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
      value: store.getNestedObservable<string>('updateDto.type'),
      onSelectChange: (code: string) => {
        store.setNested('updateDto.type', code);
        const port = DEFAULT_PORTS[code];
        store.setNested('updateDto.port', port);
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
      value: store.getNestedObservable<string>('updateDto.host'),
      onChange: (value: string) => {
        store.setNested('updateDto.host', value);
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
      value: store.getNestedObservable<number>('updateDto.port'),
      onChange: (value: number) => {
        store.setNested('updateDto.port', value);
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
      value: store.getNestedObservable<string>('updateDto.username'),
      onChange: (value: string) => {
        store.setNested('updateDto.username', value);
      },
    },
  };

  const passwordField: DynamicField<PasswordFieldProps> = {
    id: 'password',
    label: 'Password',
    variant: FieldVariant.PASSWORD,
    description: 'Leave blank to keep the current password',
    props: {
      placeholder: '••••••••',
      value: store.getNestedObservable<string>('updateDto.password'),
      onChange: (value: string) => {
        store.setNested('updateDto.password', value);
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
      value: store.getNestedObservable<string>('updateDto.defaultDatabase'),
      onChange: (value: string) => {
        store.setNested('updateDto.defaultDatabase', value);
      },
    },
  };
  const sslField: DynamicField<SwitchFieldProps> = {
    id: 'ssl',
    label: 'SSL Encryption',
    variant: FieldVariant.SWITCH,
    description: 'Enable secure SSL/TLS connection',
    props: {
      checked: store.getNestedObservable<boolean>('updateDto.ssl'),
      onCheckedChange: (value: boolean) => {
        store.setNested('updateDto.ssl', value);
      },
    },
  };

  return {
    title: 'Update Data Source',
    description: 'Update your database connection settings.',
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
