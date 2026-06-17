import { Component, inject, OnDestroy, OnInit, signal, ViewContainerRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrnDialogRef } from '@spartan-ng/brain/dialog';
import { toast } from 'ngx-sonner';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucidePlus,
  lucideDatabase,
  lucidePencil,
  lucideTrash2,
  lucideShieldCheck,
  lucideShieldOff,
  lucideCircleDot,
  lucideRefreshCw,
  lucideServer,
  lucideZap,
} from '@ng-icons/lucide';

import { LayoutService } from '@/components/layout/layout.service';
import { SheetService } from '@/components/sheet/sheet.service';
import { DialogService } from '@/components/dialog/dialog.service';
import { DataSourceService } from './data-source.service';
import { DataSourceRepository } from '@/stores/data-source-state/data-source-state.repository';
import {
  getDataSourceCreateFormStructure,
  getDataSourceUpdateFormStructure,
} from './utils/data-source.form-structure';
import { getDataSourceCreateSheet, getDataSourceUpdateSheet } from './utils/data-source.sheet';
import type { CreateDataSourceDto, ResponseDataSourceDto, UpdateDataSourceDto } from '@/types';

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
  imports: [CommonModule, ...HlmButtonImports, ...HlmBadgeImports, ...HlmIconImports, NgIcon],
  viewProviders: [
    provideIcons({
      lucidePlus,
      lucideDatabase,
      lucidePencil,
      lucideTrash2,
      lucideShieldCheck,
      lucideShieldOff,
      lucideCircleDot,
      lucideRefreshCw,
      lucideServer,
      lucideZap,
    }),
  ],
  templateUrl: './data-sources.component.html',
  styleUrls: ['./data-sources.component.css'],
})
export class DataSourcesComponent implements OnInit, OnDestroy {
  private layoutService = inject(LayoutService);
  private dataSourceService = inject(DataSourceService);
  private store = inject(DataSourceRepository);
  private sheetService = inject(SheetService);
  private dialogService = inject(DialogService);
  private vcr = inject(ViewContainerRef);

  private sheetRef: BrnDialogRef | null = null;
  private editingId: string | null = null;

  dataSources = signal<ResponseDataSourceDto[]>([]);
  loading = signal(true);
  testingId = signal<string | null>(null);

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

  // ── CRUD operations ──────────────────────────────────────

  openCreateSheet() {
    this.editingId = null;
    this.store.reset();

    const structure = getDataSourceCreateFormStructure({ store: this.store });

    this.sheetRef = this.sheetService.open(
      this.vcr,
      getDataSourceCreateSheet({
        structure,
        onSave: () => this.onCreateSave(),
        onCancel: () => this.closeSheet(),
      }),
    );
  }

  private onCreateSave() {
    const createDto = this.store.get<CreateDataSourceDto>('createDto');
    this.dataSourceService.create(createDto).subscribe({
      next: () => {
        this.closeSheet();
        this.loadDataSources();
        toast.success('Data source created successfully');
      },
      error: () => toast.error('Failed to create data source'),
    });
  }

  openUpdateSheet(ds: ResponseDataSourceDto) {
    this.editingId = ds.id;
    this.store.reset();
    this.store.set('updateDto', {
      name: ds.name,
      type: ds.type,
      host: ds.host,
      port: ds.port,
      username: ds.username,
      password: ds.password,
      defaultDatabase: ds.defaultDatabase ?? '',
      ssl: ds.ssl,
      isActive: ds.isActive,
    });

    const structure = getDataSourceUpdateFormStructure({ store: this.store });

    this.sheetRef = this.sheetService.open(
      this.vcr,
      getDataSourceUpdateSheet({
        structure,
        onSave: () => this.onUpdateSave(),
        onCancel: () => this.closeSheet(),
      }),
    );
  }

  private onUpdateSave() {
    if (!this.editingId) return;

    const updateDto = this.store.get<UpdateDataSourceDto>('updateDto');
    const payload = { ...updateDto };
    if (!payload.password) {
      delete payload.password;
    }

    this.dataSourceService.update(this.editingId, payload).subscribe({
      next: () => {
        this.closeSheet();
        this.loadDataSources();
        toast.success('Data source updated successfully');
      },
      error: () => toast.error('Failed to update data source'),
    });
  }

  private closeSheet() {
    this.sheetRef?.close();
    this.sheetRef = null;
    this.editingId = null;
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
