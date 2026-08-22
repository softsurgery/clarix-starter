import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { toast } from 'ngx-sonner';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { FormBuilderComponent } from '@/components/form-builder/form-builder.component';
import { LayoutService } from '@/components/layout/layout.service';
import { GlobalLoaderService } from '@/components/global-loader/global-loader.service';
import { DataSourceService } from '../data-source.service';
import { DataSourceRepository } from '@/stores/data-source-state/data-source-state.repository';
import { getDataSourceCreateFormStructure } from './utils/create-data-source.form-structure';
import { applyListedDatabases } from '../utils/data-source-databases';
import type { CreateDataSourceDto } from '@/types';
import { DataSourceFooterComponent } from '../data-source-footer.component';

@Component({
  selector: 'app-create-data-source',
  standalone: true,
  imports: [CommonModule, FormBuilderComponent, ...HlmButtonImports],
  templateUrl: './create-data-source.component.html',
})
export class CreateDataSourceComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private layoutService = inject(LayoutService);
  private dataSourceService = inject(DataSourceService);
  private store = inject(DataSourceRepository);
  private globalLoader = inject(GlobalLoaderService);

  saving = signal(false);
  testing = signal(false);
  formStructure = signal<any>(null);

  ngOnInit() {
    this.layoutService.setBreadcrumbs([
      { label: 'Data Sources', url: '/data-sources' },
      { label: 'New Data Source', url: '' },
    ]);
    this.layoutService.setIntro('New Data Source', 'Configure a new database connection.');

    this.layoutService.setFooter(DataSourceFooterComponent, {
      saving: this.saving,
      testing: this.testing,
      submitLabel: 'Save Connection',
      onTest: () => this.onTest(),
      onSave: () => this.onSave(),
    });

    this.initForm();
  }

  ngOnDestroy() {
    this.layoutService.clearBreadcrumbs();
    this.layoutService.clearIntro();
    this.layoutService.clearFooter();
  }

  private initForm() {
    this.store.reset();
    this.formStructure.set(getDataSourceCreateFormStructure({ store: this.store }));
  }

  onTest() {
    const createDto = this.store.get<CreateDataSourceDto>('createDto');
    if (!createDto.host || !createDto.port || !createDto.username || !createDto.password) {
      toast.error('Fill in host, port, username, and password first');
      return;
    }

    this.testing.set(true);
    this.globalLoader.show();
    this.dataSourceService.listDatabases(createDto).subscribe({
      next: (result) => {
        this.testing.set(false);
        this.globalLoader.hide();
        if (!result.success) {
          toast.error(result.message || 'Failed to list databases');
          return;
        }
        applyListedDatabases(this.store, 'createDto', result.databases);
        toast.success(
          result.databases.length === 1
            ? 'Connected — 1 database available'
            : `Connected — ${result.databases.length} databases available`,
        );
      },
      error: () => {
        this.testing.set(false);
        this.globalLoader.hide();
        toast.error('Failed to list databases');
      },
    });
  }

  onSave() {
    this.saving.set(true);
    const createDto = this.store.get<CreateDataSourceDto>('createDto');
    this.dataSourceService.create(createDto).subscribe({
      next: () => {
        this.saving.set(false);
        toast.success('Data source created successfully');
        this.router.navigate(['/data-sources']);
      },
      error: () => {
        this.saving.set(false);
        toast.error('Failed to create data source');
      },
    });
  }
}
