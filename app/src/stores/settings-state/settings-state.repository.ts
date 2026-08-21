import { Injectable } from '@angular/core';
import { BaseStoreRepository } from '../base-store.repository';
import { select } from '@ngneat/elf';
import {
  settingsInitialState,
  SettingsStateProps,
  settingsStateStore,
} from './settings-state.store';

@Injectable({
  providedIn: 'root',
})
export class SettingsRepository extends BaseStoreRepository<SettingsStateProps> {
  constructor() {
    super(
      settingsStateStore.pipe(select((state) => state)),
      settingsStateStore,
      settingsInitialState,
    );
  }
}
