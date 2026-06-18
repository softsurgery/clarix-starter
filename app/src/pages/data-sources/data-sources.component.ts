import { Component, inject, OnDestroy, OnInit, signal, ViewContainerRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { toast } from 'ngx-sonner';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucidePlus,

  lucidePencil,
  lucideTrash2,
  lucideShieldCheck,
  lucideShieldOff,
  lucideCircleDot,
  lucideRefreshCw,
  lucideServer,
  lucideZap,
  lucideLayoutGrid,
  lucideList,
} from '@ng-icons/lucide';

import { LayoutService } from '@/components/layout/layout.service';
import { DialogService } from '@/components/dialog/dialog.service';
import { DataSourceService } from './data-source.service';
import type { ResponseDataSourceDto } from '@/types';
import { DatatableBuilderComponent } from '@/components/datatable-builder/datatable-builder.component';
import { DynamicDataTable } from '@/components/datatable-builder/datatable-builder.types';
import { getDataSourceDataTableObject } from './utils/data-source.data-table';

const DB_LABELS: Record<string, string> = {
  postgresql: 'PostgreSQL',
  mysql: 'MySQL',
  mariadb: 'MariaDB',
  oracle: 'Oracle',
};

const DB_COLORS: Record<string, string> = {
  postgresql: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30',
  mysql: 'bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/30',
  mariadb: 'bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30',
  oracle: 'bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30',
};

const DB_ICON_COLORS: Record<string, string> = {
  postgresql: 'text-blue-500',
  mysql: 'text-orange-500',
  mariadb: 'text-sky-500',
  oracle: 'text-red-500',
};

@Component({
  selector: 'app-data-sources',
  imports: [CommonModule, DatatableBuilderComponent, ...HlmButtonImports, ...HlmBadgeImports, ...HlmIconImports, NgIcon],
  viewProviders: [
    provideIcons({
      lucidePlus,

      lucidePencil,
      lucideTrash2,
      lucideShieldCheck,
      lucideShieldOff,
      lucideCircleDot,
      lucideRefreshCw,
      lucideServer,
      lucideZap,
      lucideLayoutGrid,
      lucideList,
    }),
  ],
  templateUrl: './data-sources.component.html',
  styleUrls: ['./data-sources.component.css'],
})
export class DataSourcesComponent implements OnInit, OnDestroy {
  private layoutService = inject(LayoutService);
  private dataSourceService = inject(DataSourceService);
  private dialogService = inject(DialogService);
  private router = inject(Router);
  private vcr = inject(ViewContainerRef);

  dataSources = signal<ResponseDataSourceDto[]>([]);
  dataSources$ = new BehaviorSubject<ResponseDataSourceDto[]>([]);
  totalRecords$ = new BehaviorSubject<number>(0);
  loading = signal(true);
  testingId = signal<string | null>(null);

  dataTableObject: DynamicDataTable<ResponseDataSourceDto> = getDataSourceDataTableObject({
    onCreateAction: () => this.navigateToCreate(),
    onEditAction: (row) => this.navigateToUpdate(row.id),
    onDeleteAction: (row) => this.confirmDelete(row),
    onTestAction: (row) => this.testConnection(row),
  });

  // Persist viewMode in localStorage
  viewMode = signal<'grid' | 'list'>(
    (localStorage.getItem('clarix_ds_view_mode') as 'grid' | 'list') || 'grid',
  );

  ngOnInit() {
    this.layoutService.setBreadcrumbs([{ label: 'Data Sources', url: '/data-sources' }]);
    this.layoutService.setIntro('Data Sources', 'Configure and manage your database connections.');
    this.loadDataSources();
  }

  ngOnDestroy() {
    this.layoutService.clearBreadcrumbs();
    this.layoutService.clearIntro();
  }

  loadDataSources() {
    this.loading.set(true);
    this.dataSourceService.findAll().subscribe({
      next: (data) => {
        this.dataSources.set(data);
        this.dataSources$.next(data);
        this.totalRecords$.next(data.length);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        toast.error('Failed to load data sources');
      },
    });
  }

  getTypeLabel(type: string): string {
    return DB_LABELS[type] ?? type;
  }

  getTypeBadgeClass(type: string): string {
    return DB_COLORS[type] ?? 'bg-muted text-muted-foreground border-border';
  }

  getIconColor(type: string): string {
    return DB_ICON_COLORS[type] ?? 'text-muted-foreground';
  }

  setViewMode(mode: 'grid' | 'list') {
    this.viewMode.set(mode);
    localStorage.setItem('clarix_ds_view_mode', mode);
  }

  navigateToCreate() {
    this.router.navigate(['/data-sources/new']);
  }

  navigateToUpdate(id: string) {
    this.router.navigate(['/data-sources', id]);
  }

  confirmDelete(ds: ResponseDataSourceDto) {
    const ref = this.dialogService.open(this.vcr, {
      title: 'Delete Data Source',
      description: `Are you sure you want to delete "${ds.name}"? This action cannot be undone.`,
      width: '420px',
      actions: [
        { label: 'Cancel', variant: 'outline', onClick: () => ref.close() },
        { label: 'Delete', variant: 'destructive', onClick: () => ref.close(true) },
      ],
    });

    ref.closed$.subscribe((confirmed) => {
      if (confirmed) {
        this.dataSourceService.delete(ds.id).subscribe({
          next: () => {
            this.loadDataSources();
            toast.success('Data source deleted successfully');
          },
          error: () => toast.error('Failed to delete data source'),
        });
      }
    });
  }

  testConnection(ds: ResponseDataSourceDto) {
    this.testingId.set(ds.id);
    this.dataSourceService.testConnection(ds.id).subscribe({
      next: (result) => {
        this.testingId.set(null);
        if (result.success) {
          toast.success(result.message);
        } else {
          toast.error(result.message);
        }
      },
      error: () => {
        this.testingId.set(null);
        toast.error('Connection test failed');
      },
    });
  }
}
