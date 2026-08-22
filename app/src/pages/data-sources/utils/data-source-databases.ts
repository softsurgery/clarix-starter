import { SelectOption } from '@/components/form-builder/form-builder.types';
import { DataSourceRepository } from '@/stores/data-source-state/data-source-state.repository';

export function toDatabaseSelectOptions(databases: string[]): SelectOption[] {
  return databases.map((name) => ({ name, code: name }));
}

export function applyListedDatabases(
  store: DataSourceRepository,
  dtoPath: 'createDto' | 'updateDto',
  databases: string[],
): void {
  const current = store.getNested<string>(`${dtoPath}.defaultDatabase`) ?? '';
  store.set('databaseOptions', toDatabaseSelectOptions(databases));

  if (databases.length === 1) {
    store.setNested(`${dtoPath}.defaultDatabase`, databases[0]);
    return;
  }

  if (current && !databases.includes(current)) {
    store.setNested(`${dtoPath}.defaultDatabase`, '');
  }
}

export function clearListedDatabases(
  store: DataSourceRepository,
  dtoPath: 'createDto' | 'updateDto',
): void {
  store.set('databaseOptions', []);
  store.setNested(`${dtoPath}.defaultDatabase`, '');
}
