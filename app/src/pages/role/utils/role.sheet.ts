import { FormBuilderComponent } from '@/components/form-builder/form-builder.component';
import { DynamicForm } from '@/components/form-builder/form-builder.types';
import { SheetAction, SheetObject } from '@/components/sheet/types';

interface RoleSheetProps {
  structure: DynamicForm;
  onSave: () => void;
  onCancel: () => void;
  mode: 'create' | 'update';
}

export const getRoleSheet = ({
  structure,
  onSave,
  onCancel,
  mode,
}: RoleSheetProps): SheetObject => {
  const actions: SheetAction[] = [
    { label: 'Cancel', variant: 'outline', onClick: onCancel },
    {
      label: mode === 'create' ? 'Save' : 'Update',
      variant: 'default',
      onClick: onSave,
    },
  ];

  return {
    title: mode === 'create' ? 'Create Role' : 'Update Role',
    description: 'Define the role details.',
    component: {
      outlet: FormBuilderComponent,
      props: { structure },
    },
    actions,
    width: '500px',
  };
};
