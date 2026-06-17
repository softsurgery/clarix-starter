import { FormBuilderComponent } from '@/components/form-builder/form-builder.component';
import { DynamicForm } from '@/components/form-builder/form-builder.types';
import { SheetAction, SheetObject } from '@/components/sheet/types';

interface DataSourceSheetProps {
  structure: DynamicForm;
  onSave: () => void;
  onCancel: () => void;
}

export const getDataSourceCreateSheet = ({
  structure,
  onSave,
  onCancel,
}: DataSourceSheetProps): SheetObject => {
  const actions: SheetAction[] = [
    { label: 'Cancel', variant: 'outline', onClick: onCancel },
    { label: 'Save', variant: 'default', onClick: onSave },
  ];

  return {
    title: 'New Data Source',
    description: 'Configure a new database connection.',
    component: {
      outlet: FormBuilderComponent,
      props: { structure },
    },
    actions,
    width: '500px',
  };
};

export const getDataSourceUpdateSheet = ({
  structure,
  onSave,
  onCancel,
}: DataSourceSheetProps): SheetObject => {
  const actions: SheetAction[] = [
    { label: 'Cancel', variant: 'outline', onClick: onCancel },
    { label: 'Update', variant: 'default', onClick: onSave },
  ];

  return {
    title: 'Update Data Source',
    description: 'Modify database connection settings.',
    component: {
      outlet: FormBuilderComponent,
      props: { structure },
    },
    actions,
    width: '500px',
  };
};
