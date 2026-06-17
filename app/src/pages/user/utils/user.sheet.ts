import { FormBuilderComponent } from '@/components/form-builder/form-builder.component';
import { DynamicForm } from '@/components/form-builder/form-builder.types';
import { SheetAction, SheetObject } from '@/components/sheet/types';

interface UserCreateSheetProps {
  structure: DynamicForm;
  onSave: () => void;
  onCancel: () => void;
}

export const getUserCreateSheet = ({
  structure,
  onSave,
  onCancel,
}: UserCreateSheetProps): SheetObject => {
  const actions: SheetAction[] = [
    { label: 'Cancel', variant: 'outline', onClick: onCancel },
    { label: 'Save', variant: 'default', onClick: onSave },
  ];

  return {
    title: 'Create User',
    description: 'Fill in the details to create a new user.',
    component: {
      outlet: FormBuilderComponent,
      props: { structure },
    },
    actions,
    width: '500px',
  };
};

export const getUserUpdateSheet = ({
  structure,
  onSave,
  onCancel,
}: UserCreateSheetProps): SheetObject => {
  const actions: SheetAction[] = [
    { label: 'Cancel', variant: 'outline', onClick: onCancel },
    { label: 'Update', variant: 'default', onClick: onSave },
  ];

  return {
    title: 'Update User',
    description: 'Update the user details.',
    component: {
      outlet: FormBuilderComponent,
      props: { structure },
    },
    actions,
    width: '500px',
  };
};
