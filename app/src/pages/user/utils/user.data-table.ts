import { flexRenderComponent } from '@tanstack/angular-table';
import {
  DataTableServerQuery,
  DataTableVariant,
  DynamicDataTable,
} from '@/components/datatable-builder/datatable-builder.types';
import { ResponseUserDto } from '@/types';
import { TableHeadSortButton } from '@/components/datatable-builder/core/sort-header-button';
import { checkboxColumnDef } from '@/components/datatable-builder/utils/datatable-builder-select';

interface UserDataTableProps {
  onCreateAction?: () => void;
  onEditAction?: (row: ResponseUserDto) => void;
  onDeleteAction?: (row: ResponseUserDto) => void;
  serverQuery?: DataTableServerQuery;
}

export const getUserDataTableObject = ({
  onCreateAction,
  onEditAction,
  onDeleteAction,
  serverQuery,
}: UserDataTableProps): DynamicDataTable<ResponseUserDto> => {
  return {
    singular: 'User',
    plural: 'Users',
    variant: DataTableVariant.COMMON,
    createAction: onCreateAction
      ? { label: 'Create User', action: onCreateAction }
      : undefined,
    enableServerActions: true,
    searchableFields: ['username', 'email', 'firstName', 'lastName'],
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
        accessorKey: 'username',
        id: 'username',
        header: () =>
          flexRenderComponent(TableHeadSortButton, {
            inputs: { header: 'Username' },
          }),
        cell: (info) => `<div class="font-medium">${info.getValue<string>()}</div>`,
      },
      {
        accessorKey: 'email',
        id: 'email',
        header: 'Email',
        enableSorting: false,
        cell: (info) => `<div>${info.getValue<string>()}</div>`,
      },
      {
        accessorFn: (row) => row.role?.label ?? '',
        id: 'role',
        header: 'Role',
        enableSorting: false,
        cell: (info) => `<div class="capitalize">${info.getValue<string>()}</div>`,
      },
      {
        accessorKey: 'isActive',
        id: 'isActive',
        header: 'Active',
        enableSorting: false,
        cell: (info) => {
          const active = info.getValue<boolean>();
          return active
            ? '<span class="text-green-600">Yes</span>'
            : '<span class="text-muted-foreground">No</span>';
        },
      },
    ],
  };
};
