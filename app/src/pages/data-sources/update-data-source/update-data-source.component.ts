import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { toast } from 'ngx-sonner';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { FormBuilderComponent } from '@/components/form-builder/form-builder.component';
import { LayoutService } from '@/components/layout/layout.service';
import { GlobalLoaderService } from '@/components/global-loader/global-loader.service';
import { DataSourceService } from '../data-source.service';
import { DataSourceRepository } from '@/stores/data-source-state/data-source-state.repository';
import { getDataSourceUpdateFormStructure } from './utils/update-data-source.form-structure';
import { applyListedDatabases, toDatabaseSelectOptions } from '../utils/data-source-databases';
import type { UpdateDataSourceDto } from '@/types';
import { DataSourceFooterComponent } from '../data-source-footer.component';

@Component({
  selector: 'app-update-data-source',
  standalone: true,
  imports: [CommonModule, FormBuilderComponent, ...HlmButtonImports],
  templateUrl: './update-data-source.component.html',
})
export class UpdateDataSourceComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private layoutService = inject(LayoutService);
  private dataSourceService = inject(DataSourceService);
  private store = inject(DataSourceRepository);
  private globalLoader = inject(GlobalLoaderService);

  loading = signal(false);
  saving = signal(false);
  testing = signal(false);
  formStructure = signal<any>(null);
  private id: string | null = null;

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');

    this.layoutService.setBreadcrumbs([
      { label: 'Data Sources', url: '/data-sources' },
      { label: 'Edit Data Source', url: '' },
    ]);
    this.layoutService.setIntro('Edit Data Source', 'Modify database connection settings.');

    this.layoutService.setFooter(DataSourceFooterComponent, {
      saving: this.saving,
      loading: this.loading,
      testing: this.testing,
      submitLabel: 'Update Connection',
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
    if (this.id) {
      this.loading.set(true);
      this.dataSourceService.findOneById(this.id).subscribe({
        next: (ds) => {
          this.loading.set(false);
          if (ds) {
            this.store.set('updateDto', {
              name: ds.name,
              type: ds.type,
              host: ds.host,
              port: ds.port,
              username: ds.username,
              password: '',
              defaultDatabase: ds.defaultDatabase ?? '',
              ssl: ds.ssl,
              isActive: ds.isActive,
            });
            if (ds.defaultDatabase) {
              this.store.set('databaseOptions', toDatabaseSelectOptions([ds.defaultDatabase]));
            }
            this.formStructure.set(getDataSourceUpdateFormStructure({ store: this.store }));
            this.loadDatabases();
          } else {
            toast.error('Data source not found');
            this.router.navigate(['/data-sources']);
          }
        },
        error: () => {
          this.loading.set(false);
          toast.error('Failed to load data source');
          this.router.navigate(['/data-sources']);
        },
      });
    }
  }

  onTest() {
    this.loadDatabases(true);
  }

  private loadDatabases(showToast = false) {
    if (!this.id) return;

    const updateDto = this.store.get<UpdateDataSourceDto>('updateDto');
    this.testing.set(true);
    if (showToast) {
      this.globalLoader.show();
    }
    this.dataSourceService
      .listDatabases({
        id: this.id,
        ...updateDto,
      })
      .subscribe({
        next: (result) => {
          this.testing.set(false);
          if (showToast) {
            this.globalLoader.hide();
          }
          if (!result.success) {
            if (showToast) {
              toast.error(result.message || 'Failed to list databases');
            }
            return;
          }
          applyListedDatabases(this.store, 'updateDto', result.databases);
          if (showToast) {
            toast.success(
              result.databases.length === 1
                ? 'Connected — 1 database available'
                : `Connected — ${result.databases.length} databases available`,
            );
          }
        },
        error: () => {
          this.testing.set(false);
          if (showToast) {
            this.globalLoader.hide();
            toast.error('Failed to list databases');
          }
        },
      });
  }

  onSave() {
    if (!this.id) return;
    this.saving.set(true);
    const updateDto = this.store.get<UpdateDataSourceDto>('updateDto');
    const payload = { ...updateDto };
    if (!payload.password) {
      delete payload.password;
    }
    this.dataSourceService.update(this.id, payload).subscribe({
      next: () => {
        this.saving.set(false);
        toast.success('Data source updated successfully');
        this.router.navigate(['/data-sources']);
      },
      error: () => {
        this.saving.set(false);
        toast.error('Failed to update data source');
      },
    });
  }
}
