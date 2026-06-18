import {
  DynamicField,
  DynamicForm,
  FieldVariant,
  PasswordFieldProps,
  SelectFieldProps,
  SelectOption,
  TextFieldProps,
} from '@/components/form-builder/form-builder.types';
import { UserRepository } from '@/stores/user-state/user-state.repository';
import { Observable } from 'rxjs';

interface UserCreateFormStructureProps {
  store: UserRepository;
  roles: Observable<SelectOption[]>;
}

export const getUserCreateFormStructure = ({
  store,
  roles,
}: UserCreateFormStructureProps): DynamicForm => {
  const fields: DynamicField[] = [
    {
      id: 'username',
      label: 'Username',
      variant: FieldVariant.TEXT,
      isRequired: true,
      props: {
        placeholder: 'Username',
        value: store.getNestedObservable<string>('createDto.username'),
        onChange: (value: string) => {
          store.setNested('createDto.username', value);
        },
      },
    } satisfies DynamicField<TextFieldProps>,
    {
      id: 'email',
      label: 'Email',
      variant: FieldVariant.EMAIL,
      isRequired: true,
      props: {
        placeholder: 'user@example.com',
        value: store.getNestedObservable<string>('createDto.email'),
        onChange: (value: string) => {
          store.setNested('createDto.email', value);
        },
      },
    },
    {
      id: 'password',
      label: 'Password',
      variant: FieldVariant.PASSWORD,
      isRequired: true,
      props: {
        placeholder: 'Password',
        value: store.getNestedObservable<string>('createDto.password'),
        onChange: (value: string) => {
          store.setNested('createDto.password', value);
        },
      },
    } satisfies DynamicField<PasswordFieldProps>,
    {
      id: 'firstName',
      label: 'First name',
      variant: FieldVariant.TEXT,
      props: {
        placeholder: 'First name',
        value: store.getNestedObservable<string>('createDto.firstName'),
        onChange: (value: string) => {
          store.setNested('createDto.firstName', value);
        },
      },
    } satisfies DynamicField<TextFieldProps>,
    {
      id: 'lastName',
      label: 'Last name',
      variant: FieldVariant.TEXT,
      props: {
        placeholder: 'Last name',
        value: store.getNestedObservable<string>('createDto.lastName'),
        onChange: (value: string) => {
          store.setNested('createDto.lastName', value);
        },
      },
    } satisfies DynamicField<TextFieldProps>,
    {
      id: 'roleId',
      label: 'Role',
      variant: FieldVariant.SELECT,
      isRequired: true,
      props: {
        options: roles,
        placeholder: 'Choose a role',
        value: store.getNestedObservable<string>('createDto.roleId'),
        onSelectChange: (code: string) => {
          store.setNested('createDto.roleId', code);
        },
      },
    } satisfies DynamicField<SelectFieldProps>,
  ];

  return {
    title: 'Create User',
    description: 'Fill out the form below to create a new user.',
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

export const getUserUpdateFormStructure = ({
  store,
  roles,
}: UserCreateFormStructureProps): DynamicForm => {
  const fields: DynamicField[] = [
    {
      id: 'username',
      label: 'Username',
      variant: FieldVariant.TEXT,
      isRequired: true,
      props: {
        placeholder: 'Username',
        value: store.getNestedObservable<string>('updateDto.username'),
        onChange: (value: string) => {
          store.setNested('updateDto.username', value);
        },
      },
    } satisfies DynamicField<TextFieldProps>,
    {
      id: 'email',
      label: 'Email',
      variant: FieldVariant.EMAIL,
      isRequired: true,
      props: {
        placeholder: 'user@example.com',
        value: store.getNestedObservable<string>('updateDto.email'),
        onChange: (value: string) => {
          store.setNested('updateDto.email', value);
        },
      },
    },
    {
      id: 'password',
      label: 'Password',
      variant: FieldVariant.PASSWORD,
      description: 'Leave blank to keep the current password',
      props: {
        placeholder: 'New password',
        value: store.getNestedObservable<string>('updateDto.password'),
        onChange: (value: string) => {
          store.setNested('updateDto.password', value);
        },
      },
    } satisfies DynamicField<PasswordFieldProps>,
    {
      id: 'firstName',
      label: 'First name',
      variant: FieldVariant.TEXT,
      props: {
        placeholder: 'First name',
        value: store.getNestedObservable<string>('updateDto.firstName'),
        onChange: (value: string) => {
          store.setNested('updateDto.firstName', value);
        },
      },
    } satisfies DynamicField<TextFieldProps>,
    {
      id: 'lastName',
      label: 'Last name',
      variant: FieldVariant.TEXT,
      props: {
        placeholder: 'Last name',
        value: store.getNestedObservable<string>('updateDto.lastName'),
        onChange: (value: string) => {
          store.setNested('updateDto.lastName', value);
        },
      },
    } satisfies DynamicField<TextFieldProps>,
    {
      id: 'roleId',
      label: 'Role',
      variant: FieldVariant.SELECT,
      isRequired: true,
      props: {
        options: roles,
        placeholder: 'Choose a role',
        value: store.getNestedObservable<string>('updateDto.roleId'),
        onSelectChange: (code: string) => {
          store.setNested('updateDto.roleId', code);
        },
      },
    } satisfies DynamicField<SelectFieldProps>,
    {
      id: 'isActive',
      label: 'Active',
      variant: FieldVariant.SWITCH,
      props: {
        value: store.getNestedObservable<boolean>('updateDto.isActive'),
        onChange: (value: boolean) => {
          store.setNested('updateDto.isActive', value);
        },
      },
    },
  ];

  return {
    title: 'Update User',
    description: 'Update user details below.',
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
