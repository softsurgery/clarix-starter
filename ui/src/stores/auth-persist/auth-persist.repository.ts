import { Injectable } from '@angular/core';
import { BaseStoreRepository } from '../base-store.repository';
import { select } from '@ngneat/elf';
import { authPersistInitialState, AuthPersistProps, authPersistStore } from './auth-persist.store';

@Injectable({
  providedIn: 'root',
})
export class AuthPersistRepository extends BaseStoreRepository<AuthPersistProps> {
  constructor() {
    super(
      authPersistStore.pipe(select((state) => state)),
      authPersistStore,
      authPersistInitialState,
    );
  }
}
