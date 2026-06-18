import { Injectable } from '@angular/core';
import { BaseStoreRepository } from '../base-store.repository';
import { select } from '@ngneat/elf';
import {
  dataSourceInitialState,
  DataSourceStateProps,
  dataSourceStateStore,
} from './data-source-state.store';

@Injectable({
  providedIn: 'root',
})
export class DataSourceRepository extends BaseStoreRepository<DataSourceStateProps> {
  constructor() {
    super(
      dataSourceStateStore.pipe(select((state) => state)),
      dataSourceStateStore,
      dataSourceInitialState,
    );
  }
}
