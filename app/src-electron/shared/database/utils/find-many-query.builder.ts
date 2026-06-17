import { FindManyOptions, FindOptionsWhere, ILike, In, ObjectLiteral } from 'typeorm';
import type { FindManyQueryDto } from '@/types/find-many-query.types';

function normalizeWhere<T extends ObjectLiteral>(
  where: Record<string, unknown>,
): FindOptionsWhere<T> {
  const normalized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(where)) {
    normalized[key] = Array.isArray(value) ? In(value) : value;
  }

  return normalized as FindOptionsWhere<T>;
}

export function toFindManyOptions<T extends ObjectLiteral>(
  query: FindManyQueryDto = {},
): FindManyOptions<T> {
  const options: FindManyOptions<T> = {};

  if (query.take != null) {
    options.take = query.take;
  }

  if (query.skip != null) {
    options.skip = query.skip;
  }

  if (query.relations?.length) {
    options.relations = query.relations;
  }

  if (query.sortBy && query.sortOrder) {
    options.order = {
      [query.sortBy]: query.sortOrder.toUpperCase(),
    } as FindManyOptions<T>['order'];
  }

  const trimmedSearch = query.search?.trim();
  const hasSearch = Boolean(trimmedSearch && query.searchFields?.length);
  const hasWhere = Boolean(query.where && Object.keys(query.where).length);

  if (hasSearch) {
    const term = `%${trimmedSearch}%`;
    const baseWhere = query.where ? normalizeWhere<T>(query.where) : {};

    options.where = query.searchFields!.map(
      (field) =>
        ({
          ...baseWhere,
          [field]: ILike(term),
        }) as FindOptionsWhere<T>,
    );
  } else if (hasWhere) {
    options.where = normalizeWhere<T>(query.where!);
  }

  return options;
}
