import { FormBuilderComponent } from '@/components/form-builder/form-builder.component';
import { DynamicForm } from '@/components/form-builder/form-builder.types';
import { SheetAction, SheetObject } from '@/components/sheet/types';
import { combineLatest, map, Observable, startWith } from 'rxjs';

interface DataSourceSheetProps {
  structure: DynamicForm;
  testing: Observable<boolean>;
  saving: Observable<boolean>;
  loading: Observable<boolean>;
  onTest: () => void;
  onSave: () => void;
  onCancel: () => void;
  mode: 'create' | 'update';
}

const getBusyState = ({ testing, saving, loading }: DataSourceSheetProps) =>
  combineLatest([
    testing.pipe(startWith(false)),
    saving.pipe(startWith(false)),
    loading.pipe(startWith(false)),
  ]).pipe(map(([isTesting, isSaving, isLoading]) => isTesting || isSaving || isLoading));

export const getDataSourceSheet = ({
  structure,
  testing,
  saving,
  loading,
  onTest,
  onSave,
  onCancel,
  mode,
}: DataSourceSheetProps): SheetObject => {
  const busy$ = getBusyState({ testing, saving, loading } as DataSourceSheetProps);

  return {
    title: mode === 'create' ? 'Create Data Source' : 'Update Data Source',
    description:
      mode === 'create'
        ? 'Configure a new database connection.'
        : 'Modify database connection settings.',
    component: {
      outlet: FormBuilderComponent,
      props: { structure },
    },
    actions: [
      { label: 'Cancel', variant: 'outline', onClick: onCancel },
      {
        label: 'Test Connection',
        variant: 'secondary',
        onClick: onTest,
        disabled: busy$,
      },
      {
        label: mode === 'create' ? 'Save Connection' : 'Update Connection',
        variant: 'default',
        onClick: onSave,
        disabled: busy$,
      },
    ],
    position: 'right',
    width: '50vw',
  };
};