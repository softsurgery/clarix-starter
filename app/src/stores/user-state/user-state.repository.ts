import { Injectable } from '@angular/core';
import { BaseStoreRepository } from '../base-store.repository';
import { select } from '@ngneat/elf';
import { userInitialState, UserStateProps, userStateStore } from './user-state.store';

@Injectable({
  providedIn: 'root',
})
export class UserRepository extends BaseStoreRepository<UserStateProps> {
  constructor() {
    super(
      userStateStore.pipe(select((state) => state)),
      userStateStore,
      userInitialState,
    );
  }
}
