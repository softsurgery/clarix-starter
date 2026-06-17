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
import { SelectOption } from '@/components/form-builder/form-builder.types';

const DB_TYPE_OPTIONS: SelectOption[] = [
  { name: 'PostgreSQL', code: 'postgresql' },
  { name: 'MySQL', code: 'mysql' },
  { name: 'MariaDB', code: 'mariadb' },
  { name: 'Oracle', code: 'oracle' },
];

const DEFAULT_PORTS: Record<string, number> = {
  postgresql: 5432,
  mysql: 3306,
  mariadb: 3306,
  oracle: 1521,
};

interface DataSourceFormStructureProps {
  store: DataSourceRepository;
}

export const getDataSourceCreateFormStructure = ({
  store,
}: DataSourceFormStructureProps): DynamicForm => {
  const fields: DynamicField[] = [
    {
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
    } satisfies DynamicField<TextFieldProps>,
    {
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
          const port = DEFAULT_PORTS[code] ?? 5432;
          store.setNested('createDto.port', port);
        },
      },
    } satisfies DynamicField<SelectFieldProps>,
    {
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
    } satisfies DynamicField<TextFieldProps>,
    {
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
    } satisfies DynamicField<NumberFieldProps>,
    {
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
    } satisfies DynamicField<TextFieldProps>,
    {
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
    } satisfies DynamicField<PasswordFieldProps>,
    {
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
    } satisfies DynamicField<TextFieldProps>,
    {
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
    } satisfies DynamicField<SwitchFieldProps>,
  ];

  return {
    title: 'New Data Source',
    description: 'Configure your database connection.',
    isHeaderHidden: true,
    grids: [
      {
        title: '',
        isHeaderHidden: true,
        gridItems: fields.map((field) => ({ fields: [field] })),
      },
    ],
  };
};

export const getDataSourceUpdateFormStructure = ({
  store,
}: DataSourceFormStructureProps): DynamicForm => {
  const fields: DynamicField[] = [
    {
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
    } satisfies DynamicField<TextFieldProps>,
    {
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
          const port = DEFAULT_PORTS[code] ?? 5432;
          store.setNested('updateDto.port', port);
        },
      },
    } satisfies DynamicField<SelectFieldProps>,
    {
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
    } satisfies DynamicField<TextFieldProps>,
    {
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
    } satisfies DynamicField<NumberFieldProps>,
    {
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
    } satisfies DynamicField<TextFieldProps>,
    {
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
    } satisfies DynamicField<PasswordFieldProps>,
    {
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
    } satisfies DynamicField<TextFieldProps>,
    {
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
    } satisfies DynamicField<SwitchFieldProps>,
    {
      id: 'isActive',
      label: 'Active',
      variant: FieldVariant.SWITCH,
      props: {
        checked: store.getNestedObservable<boolean>('updateDto.isActive'),
        onCheckedChange: (value: boolean) => {
          store.setNested('updateDto.isActive', value);
        },
      },
    } satisfies DynamicField<SwitchFieldProps>,
  ];

  return {
    title: 'Update Data Source',
    description: 'Update your database connection settings.',
    isHeaderHidden: true,
    grids: [
      {
        title: '',
        isHeaderHidden: true,
        gridItems: fields.map((field) => ({ fields: [field] })),
      },
    ],
  };
};
