import { Injectable } from '@angular/core';
import { BaseStoreRepository } from '../base-store.repository';
import { select } from '@ngneat/elf';
import { roleInitialState, RoleStateProps, roleStateStore } from './role-state.store';

@Injectable({
  providedIn: 'root',
})
export class RoleRepository extends BaseStoreRepository<RoleStateProps> {
  constructor() {
    super(
      roleStateStore.pipe(select((state) => state)),
      roleStateStore,
      roleInitialState,
    );
  }
}
