import { flexRenderComponent } from '@tanstack/angular-table';
import {
  DataTableServerQuery,
  DataTableVariant,
  DynamicDataTable,
} from '@/components/datatable-builder/datatable-builder.types';
import { ResponseRoleDto } from '@/types';
import { TableHeadSortButton } from '@/components/datatable-builder/core/sort-header-button';
import { checkboxColumnDef } from '@/components/datatable-builder/utils/datatable-builder-select';

interface RoleDataTableProps {
  onCreateAction?: () => void;
  onEditAction?: (row: ResponseRoleDto) => void;
  onDeleteAction?: (row: ResponseRoleDto) => void;
  serverQuery?: DataTableServerQuery;
}

export const getRoleDataTableObject = ({
  onCreateAction,
  onEditAction,
  onDeleteAction,
  serverQuery,
}: RoleDataTableProps): DynamicDataTable<ResponseRoleDto> => {
  return {
    singular: 'Role',
    plural: 'Roles',
    variant: DataTableVariant.COMMON,
    createAction: onCreateAction
      ? { label: 'Create Role', action: onCreateAction }
      : undefined,
    enableServerActions: true,
    searchableFields: ['label', 'description'],
    serverQuery,
    rowActions: {
      editAction: {
        label: 'Update',
        action: onEditAction ? onEditAction : (row) => console.log('Update', row),
      },
      deleteAction: {
        label: 'Delete',
        action: onDeleteAction ? onDeleteAction : (row) => console.log('Delete', row),
      },
    },
    columns: [
      checkboxColumnDef,
      {
        accessorKey: 'label',
        id: 'label',
        header: () =>
          flexRenderComponent(TableHeadSortButton, {
            inputs: { header: 'Label' },
          }),
        cell: (info) => `<div class="font-medium capitalize">${info.getValue<string>()}</div>`,
      },
      {
        accessorKey: 'description',
        id: 'description',
        header: 'Description',
        enableSorting: false,
        cell: (info) =>
          `<div class="${!info.getValue<string>() ? 'text-muted-foreground' : ''}">${info.getValue<string>() || 'No description'}</div>`,
      },
    ],
  };
};
