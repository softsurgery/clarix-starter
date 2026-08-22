import { Injectable } from '@angular/core';
import { BaseStoreRepository } from '../base-store.repository';
import { select } from '@ngneat/elf';
import {
  ConfigurationsStateProps,
  configurationsInitialState,
  configurationsStateStore,
} from './configurations-state.store';

@Injectable({
  providedIn: 'root',
})
export class ConfigurationsRepository extends BaseStoreRepository<ConfigurationsStateProps> {
  constructor() {
    super(
      configurationsStateStore.pipe(select((state) => state)),
      configurationsStateStore,
      configurationsInitialState,
    );
  }
}
