import { flexRenderComponent } from '@tanstack/angular-table';
import { TableHeadSelection, TableRowSelection } from '../core/selection-column';

export const checkboxColumnDef = {
  id: 'select',
  header: () => flexRenderComponent(TableHeadSelection),
  cell: () => flexRenderComponent(TableRowSelection),
  enableSorting: false,
  enableHiding: false,
};
