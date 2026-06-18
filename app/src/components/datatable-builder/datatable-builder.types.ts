import { Signal } from '@angular/core';
import { ColumnDef } from '@tanstack/angular-table';

export interface DynamicDataTable<T = any> {
  //common
  singular: string;
  plural: string;
  columns: ColumnDef<T>[];
  variant?: DataTableVariant;
  createAction?: DataTableAction;
  rowActions?: DataTableRowActions;
  rowActionsFn?: (...args: any[]) => DataTableRowActions;
  target?: (entity: T) => void;
  //styles
  showGridlines?: boolean;
  stripedRows?: boolean;
  //server actions
  enableServerActions?: boolean;
  serverQuery?: DataTableServerQuery;
  sizes?: number[];
  searchableFields?: string[];
  disablePagination?: boolean;
}

export interface DataTableServerQuery {
  page: Signal<number>;
  setPage: (page: number) => void;

  pageSize: Signal<number>;
  setPageSize: (pageSize: number) => void;

  sortBy: Signal<string>;
  setSortBy: (sortBy: string) => void;

  sortOrder: Signal<'asc' | 'desc' | undefined>;
  setSortOrder: (order: 'asc' | 'desc' | undefined) => void;

  search: Signal<string>;
  setSearch: (search: string) => void;
}

export interface DataTableAction {
  label: string;
  action?: (...args: any[]) => void;
  icon?: string;
  isHidden?: boolean;
  disabled?: boolean;
}

export interface DataTableRowActions {
  inspectAction?: DataTableAction;
  editAction?: DataTableAction;
  deleteAction?: DataTableAction;
  additionalActions?: Record<string, DataTableAction[] | undefined>;
}

export enum DataTableVariant {
  COMMON = 'common',
  EDITABLE = 'editable',
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface DataTableColumnTextProps {}

export interface DataTableColumnDateProps {
  format?: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface DataTableColumnCurrencyProps {}

export interface DataTableColumnBadgeProps {
  innerClass?: string;
  getSeverity: (
    value: any,
  ) => 'primary' | 'secondary' | 'success' | 'info' | 'warn' | 'danger' | 'contrast';
}

export interface DataTableColumnSwitchProps {
  onChange?: (checked: boolean, value: any, row: any) => void;
  disabled?: boolean;
}

export interface DataTableColumnColorProps {
  color: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface DataTableColumnImageProps {}

export interface DataTableColumnLinkProps {
  href: string;
  target?: string;
  rel?: string;
}

export enum DataTableColumnVariant {
  TEXT = 'text',
  DATE = 'date',
  CURRENCY = 'currency',
  BADGE = 'badge',
  IMAGE = 'image',
  SWITCH = 'switch',
  COLOR = 'color',
  LINK = 'link',
}
