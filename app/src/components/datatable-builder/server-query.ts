import { signal } from '@angular/core';
import { DataTableServerQuery } from './datatable-builder.types';

interface CreateServerQueryProps {
  initialPage?: number;
  initialPageSize?: number;
  initialSortBy?: string;
  initialSortOrder?: 'asc' | 'desc' | undefined;
  initialSearch?: string;
}

export function createServerQuery({
  initialPage = 0,
  initialPageSize = 10,
  initialSortBy = '',
  initialSortOrder = undefined,
  initialSearch = '',
}: CreateServerQueryProps): DataTableServerQuery {
  const page = signal(initialPage);
  const pageSize = signal(initialPageSize);
  const sortBy = signal(initialSortBy);
  const sortOrder = signal<'asc' | 'desc' | undefined>(initialSortOrder);
  const search = signal(initialSearch);

  return {
    page,
    setPage: page.set,

    pageSize,
    setPageSize: pageSize.set,

    sortBy,
    setSortBy: sortBy.set,

    sortOrder,
    setSortOrder: sortOrder.set,

    search,
    setSearch: search.set,
  };
}
