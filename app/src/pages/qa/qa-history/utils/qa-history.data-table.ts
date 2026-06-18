import { TableHeadSortButton } from '@/components/datatable-builder/core/sort-header-button';
import {
  DataTableVariant,
  DynamicDataTable,
} from '@/components/datatable-builder/datatable-builder.types';
import type { ResponseQASessionDto } from '@/types';
import { flexRenderComponent } from '@tanstack/angular-table';

interface SessionHistoryDataTableProps {
  onInspectAction?: (row: ResponseQASessionDto) => void;
  onDeleteAction?: (row: ResponseQASessionDto) => void;
}

export const getSessionHistoryDataTableObject = ({
  onInspectAction,
  onDeleteAction,
}: SessionHistoryDataTableProps): DynamicDataTable<ResponseQASessionDto> => {
  return {
    singular: 'Session',
    plural: 'Sessions',
    variant: DataTableVariant.COMMON,
    enableServerActions: false,
    disablePagination: false,
    inlinePagination: true,
    searchableFields: ['question', 'dataSourceName'],
    rowActions: {
      inspectAction: {
        label: 'Inspect Log',
        action: onInspectAction ? onInspectAction : (row) => console.log('Inspect', row),
      },
      deleteAction: {
        label: 'Delete',
        action: onDeleteAction ? onDeleteAction : (row) => console.log('Delete', row),
      },
    },
    columns: [
      {
        accessorKey: 'question',
        id: 'question',
        header: () => flexRenderComponent(TableHeadSortButton, { inputs: { header: 'Question' } }),
        cell: (info) => {
          const q = info.getValue<string>();
          const truncated = q.length > 60 ? q.slice(0, 60) + '…' : q;
          return `<div class="font-medium max-w-[280px] truncate" title="${q.replace(/"/g, '&quot;')}">${truncated}</div>`;
        },
        enableSorting: true,
      },
      {
        accessorKey: 'dataSourceName',
        id: 'dataSourceName',
        header: () =>
          flexRenderComponent(TableHeadSortButton, { inputs: { header: 'Data Source' } }),
        cell: (info) => {
          const name = info.getValue<string>();
          return name
            ? `<div class="text-muted-foreground">${name}</div>`
            : `<div class="text-muted-foreground/50">—</div>`;
        },
        enableSorting: true,
      },
      {
        accessorKey: 'status',
        id: 'status',
        header: () => flexRenderComponent(TableHeadSortButton, { inputs: { header: 'Status' } }),
        cell: (info) => {
          const status = info.getValue<string>();
          if (status === 'success') {
            return '<span class="inline-flex items-center gap-1 font-medium text-green-600 dark:text-green-400">● Success</span>';
          }
          return '<span class="inline-flex items-center gap-1 font-medium text-destructive">● Failed</span>';
        },
        enableSorting: true,
      },
      {
        accessorKey: 'durationMs',
        id: 'durationMs',
        header: () => flexRenderComponent(TableHeadSortButton, { inputs: { header: 'Duration' } }),
        cell: (info) => {
          const ms = info.getValue<number>();
          const formatted = ms < 1000 ? `${ms}ms` : `${(ms / 1000).toFixed(1)}s`;
          return `<div class="font-mono text-muted-foreground">${formatted}</div>`;
        },
        enableSorting: true,
      },
      {
        accessorKey: 'rowCount',
        id: 'rowCount',
        header: () => flexRenderComponent(TableHeadSortButton, { inputs: { header: 'Rows' } }),
        cell: (info) => {
          const count = info.getValue<number | null>();
          return count != null
            ? `<div class="text-muted-foreground">${count}</div>`
            : `<div class="text-muted-foreground/50">—</div>`;
        },
        enableSorting: true,
      },
      {
        accessorKey: 'createdAt',
        id: 'createdAt',
        header: () =>
          flexRenderComponent(TableHeadSortButton, { inputs: { header: 'Created At' } }),
        cell: (info) => {
          const date = info.getValue<string>();
          if (!date) return '<div class="text-muted-foreground/50">—</div>';
          const d = new Date(date);
          const formatted = d.toLocaleString(undefined, {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          });
          return `<div class="text-muted-foreground">${formatted}</div>`;
        },
        enableSorting: true,
      },
    ],
  };
};
