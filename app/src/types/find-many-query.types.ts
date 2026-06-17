/**
 * IPC-safe query params for list/find endpoints.
 * Serializable plain object — no TypeORM operators.
 */
export type SortOrder = 'asc' | 'desc';

export interface FindManyQueryDto {
  take?: number;
  skip?: number;
  sortBy?: string;
  sortOrder?: SortOrder;
  relations?: string[];
  search?: string;
  searchFields?: string[];
  where?: Record<string, unknown>;
}
