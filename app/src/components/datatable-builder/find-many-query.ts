import type { FindManyQueryDto } from '@/types/find-many-query.types';
import type { DataTableServerQuery, DynamicDataTable } from './datatable-builder.types';

export type FindManyQueryOverrides = Omit<
  FindManyQueryDto,
  'take' | 'skip' | 'sortBy' | 'sortOrder' | 'search'
>;

export function buildFindManyQuery(
  serverQuery: DataTableServerQuery,
  overrides: FindManyQueryOverrides = {},
  dataTable?: Pick<DynamicDataTable, 'searchableFields'>,
): FindManyQueryDto {
  const sortBy = serverQuery.sortBy();
  const sortOrder = serverQuery.sortOrder();
  const search = serverQuery.search().trim();
  const searchFields = overrides.searchFields ?? dataTable?.searchableFields;

  return {
    take: serverQuery.pageSize(),
    skip: serverQuery.page() * serverQuery.pageSize(),
    sortBy: sortBy || undefined,
    sortOrder: sortOrder || undefined,
    search: search || undefined,
    searchFields,
    ...overrides,
  };
}
