import { flexRenderComponent } from '@tanstack/angular-table';
import {
  DataTableVariant,
  DynamicDataTable,
} from '@/components/datatable-builder/datatable-builder.types';
import { ResponseDataSourceDto } from '@/types';
import { TableHeadSortButton } from '@/components/datatable-builder/core/sort-header-button';
import { checkboxColumnDef } from '@/components/datatable-builder/utils/datatable-builder-select';

interface DataSourceDataTableProps {
  onCreateAction?: () => void;
  onEditAction?: (row: ResponseDataSourceDto) => void;
  onDeleteAction?: (row: ResponseDataSourceDto) => void;
  onTestAction?: (row: ResponseDataSourceDto) => void;
}

export const getDataSourceDataTableObject = ({
  onCreateAction,
  onEditAction,
  onDeleteAction,
  onTestAction,
}: DataSourceDataTableProps): DynamicDataTable<ResponseDataSourceDto> => {
  return {
    singular: 'Data Source',
    plural: 'Data Sources',
    variant: DataTableVariant.COMMON,
    createAction: onCreateAction ? { label: 'New Connection', action: onCreateAction } : undefined,
    enableServerActions: false,
    disablePagination: false,
    rowActions: {
      editAction: {
        label: 'Edit',
        action: onEditAction ? onEditAction : (row) => console.log('Edit', row),
      },
      deleteAction: {
        label: 'Delete',
        action: onDeleteAction ? onDeleteAction : (row) => console.log('Delete', row),
      },
      additionalActions: {
        Test: [
          {
            label: 'Test Connection',
            action: onTestAction ? onTestAction : (row) => console.log('Test', row),
          },
        ],
      },
    },
    columns: [
      checkboxColumnDef,
      {
        accessorKey: 'name',
        id: 'name',
        header: () =>
          flexRenderComponent(TableHeadSortButton, {
            inputs: { header: 'Connection' },
          }),
        cell: (info) => `<div class="font-medium">${info.getValue<string>()}</div>`,
      },
      {
        accessorKey: 'type',
        id: 'type',
        header: 'Type',
        cell: (info) => `<div class="uppercase font-semibold">${info.getValue<string>()}</div>`,
      },
      {
        accessorFn: (row) => `${row.host}:${row.port}`,
        id: 'host',
        header: 'Host',
        cell: (info) =>
          `<div class="font-mono text-muted-foreground">${info.getValue<string>()}</div>`,
      },
      {
        accessorKey: 'defaultDatabase',
        id: 'defaultDatabase',
        header: 'Database',
        cell: (info) =>
          `<div class="font-mono  text-muted-foreground">${info.getValue<string>() || '—'}</div>`,
      },
      {
        accessorKey: 'isActive',
        id: 'isActive',
        header: 'Status',
        cell: (info) => {
          const active = info.getValue<boolean>();
          return active
            ? '<span class="text-green-600 font-medium">Active</span>'
            : '<span class="text-muted-foreground font-medium">Inactive</span>';
        },
      },
    ],
  };
};
