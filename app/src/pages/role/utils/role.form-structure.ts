import {
  DynamicField,
  DynamicForm,
  FieldVariant,
  TextareaFieldProps,
  TextFieldProps,
} from '@/components/form-builder/form-builder.types';
import { RoleRepository } from '@/stores/role-state/role-state.repository';

interface RoleFormStructureProps {
  store: RoleRepository;
  mode: 'create' | 'update';
}

export const getRoleFormStructure = ({ store, mode }: RoleFormStructureProps): DynamicForm => {
  const prefix = mode === 'create' ? 'createDto' : 'updateDto';

  const labelField: DynamicField<TextFieldProps> = {
    id: 'label',
    label: 'Label',
    variant: FieldVariant.TEXT,
    isRequired: true,
    props: {
      placeholder: 'Role label',
      value: store.getNestedObservable<string>(`${prefix}.label`),
      onChange: (value: string) => {
        store.setNested(`${prefix}.label`, value);
      },
    },
  };

  const descriptionField: DynamicField<TextareaFieldProps> = {
    id: 'description',
    label: 'Description',
    variant: FieldVariant.TEXTAREA,
    props: {
      placeholder: 'Role description',
      value: store.getNestedObservable<string>(`${prefix}.description`),
      onChange: (value: string) => {
        store.setNested(`${prefix}.description`, value);
      },
      rows: 4,
      resize: 'none',
    },
  };

  return {
    title: mode === 'create' ? 'Create Role' : 'Update Role',
    description: 'Define the role label and description.',
    isHeaderHidden: true,
    grids: [
      {
        title: '',
        isHeaderHidden: true,
        gridItems: [{ fields: [labelField] }, { fields: [descriptionField] }],
      },
    ],
  };
};
