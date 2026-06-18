import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { toast } from 'ngx-sonner';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { FormBuilderComponent } from '@/components/form-builder/form-builder.component';
import { LayoutService } from '@/components/layout/layout.service';
import { DataSourceService } from '../data-source.service';
import { DataSourceRepository } from '@/stores/data-source-state/data-source-state.repository';
import { getDataSourceUpdateFormStructure } from './utils/update-data-source.form-structure';
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

  loading = signal(false);
  saving = signal(false);
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
      submitLabel: 'Update Connection',
      onCancel: () => this.onCancel(),
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
            this.formStructure.set(getDataSourceUpdateFormStructure({ store: this.store }));
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

  onCancel() {
    this.router.navigate(['/data-sources']);
  }
}
