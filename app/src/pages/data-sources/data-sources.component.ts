import {
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
  computed,
  ViewContainerRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';
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
import { SheetService } from '@/components/sheet/sheet.service';
import { DataSourceService } from './data-source.service';
import type { ResponseDataSourceDto } from '@/types';
import type { CreateDataSourceDto, UpdateDataSourceDto } from '@/types';
import { DatatableBuilderComponent } from '@/components/datatable-builder/datatable-builder.component';
import { DynamicDataTable } from '@/components/datatable-builder/datatable-builder.types';
import { getDataSourceDataTableObject } from './utils/data-source.data-table';
import { DataSourcesTitleComponent } from './data-sources-title.component';
import { DataSourceRepository } from '@/stores/data-source-state/data-source-state.repository';
import { getDataSourceFormStructure } from './utils/data-source.form-structure';
import { getDataSourceSheet } from './utils/data-source.sheet';
import { applyListedDatabases, toDatabaseSelectOptions } from './utils/data-source-databases';

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

import { DataSourceCardComponent } from './data-source-card/data-source-card.component';

@Component({
  selector: 'app-data-sources',
  imports: [
    CommonModule,
    DatatableBuilderComponent,
    DataSourceCardComponent,
    ...HlmButtonImports,
    ...HlmBadgeImports,
    ...HlmIconImports,
    NgIcon,
  ],
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
  private sheetService = inject(SheetService);
  private store = inject(DataSourceRepository);
  private vcr = inject(ViewContainerRef);

  dataSources = signal<ResponseDataSourceDto[]>([]);
  dataSources$ = new BehaviorSubject<ResponseDataSourceDto[]>([]);
  totalRecords$ = new BehaviorSubject<number>(0);
  loading = signal(true);
  testingId = signal<string | null>(null);

  private sheetRef: ReturnType<SheetService['open']> | null = null;
  private editingId: string | null = null;

  saving = signal(false);
  sheetTesting = signal(false);
  sheetLoading = signal(false);

  testActionObservable = toObservable(this.sheetTesting);
  saveActionObservable = toObservable(this.saving);
  loadActionObservable = toObservable(this.sheetLoading);

  dataTableObject: DynamicDataTable<ResponseDataSourceDto> = getDataSourceDataTableObject({
    onCreateAction: () => this.openCreateSheet(),
    onEditAction: (row) => this.openUpdateSheet(row),
    onDeleteAction: (row) => this.confirmDelete(row),
    onTestAction: (row) => this.testConnection(row),
  });

  // Persist viewMode in localStorage
  viewMode = signal<'grid' | 'list'>(
    (localStorage.getItem('clarix_ds_view_mode') as 'grid' | 'list') || 'grid',
  );

  hasDataSources = computed(() => this.dataSources().length > 0);

  ngOnInit() {
    this.layoutService.setBreadcrumbs([{ label: 'Data Sources', url: '/data-sources' }]);
    this.layoutService.setIntro('Data Sources', 'Configure and manage your database connections.');
    this.layoutService.setTitleContent(DataSourcesTitleComponent, {
      viewMode: this.viewMode,
      setViewMode: (mode: 'grid' | 'list') => this.setViewMode(mode),
      hasDataSources: this.hasDataSources,
    });
    this.loadDataSources();
  }

  ngOnDestroy() {
    this.layoutService.clearBreadcrumbs();
    this.layoutService.clearIntro();
    this.layoutService.clearTitleContent();
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

  // ── Create / Update sheets ────────────────────────────────────────────────

  openCreateSheet() {
    this.editingId = null;
    this.store.reset();
    this.saving.set(false);
    this.sheetTesting.set(false);
    this.sheetLoading.set(false);

    const structure = getDataSourceFormStructure({ store: this.store, mode: 'create' });
    this.sheetRef = this.sheetService.open(
      this.vcr,
      getDataSourceSheet({
        structure,
        testing: this.testActionObservable,
        saving: this.saveActionObservable,
        loading: this.loadActionObservable,
        onTest: () => this.onTestConnection('createDto'),
        onSave: () => this.onCreateSave(),
        onCancel: () => this.closeSheet(),
        mode: 'create',
      }),
    );
  }

  openUpdateSheet(row: ResponseDataSourceDto) {
    this.editingId = row.id;
    this.saving.set(false);
    this.sheetTesting.set(false);
    this.sheetLoading.set(false);
    this.store.reset();
    this.store.set('updateDto', {
      name: row.name,
      type: row.type,
      host: row.host,
      port: row.port,
      username: row.username,
      password: '',
      defaultDatabase: row.defaultDatabase ?? '',
      ssl: row.ssl ?? false,
      isActive: row.isActive,
    });
    if (row.defaultDatabase) {
      this.store.set('databaseOptions', toDatabaseSelectOptions([row.defaultDatabase]));
    }

    const structure = getDataSourceFormStructure({ store: this.store, mode: 'update' });
    this.sheetRef = this.sheetService.open(
      this.vcr,
      getDataSourceSheet({
        structure,
        testing: this.testActionObservable,
        saving: this.saveActionObservable,
        loading: this.loadActionObservable,
        onTest: () => this.onTestConnection('updateDto'),
        onSave: () => this.onUpdateSave(),
        onCancel: () => this.closeSheet(),
        mode: 'update',
      }),
    );

    this.loadDatabasesSilently();
  }

  private onTestConnection(dtoPath: 'createDto' | 'updateDto') {
    const dto = this.store.get<CreateDataSourceDto | UpdateDataSourceDto>(dtoPath);
    if (!dto.host || !dto.port || !dto.username || (!dto.password && dtoPath === 'createDto')) {
      toast.error('Fill in host, port, username, and password first');
      return;
    }

    const input =
      dtoPath === 'updateDto' && this.editingId
        ? { id: this.editingId, ...dto }
        : { ...dto };

    this.sheetTesting.set(true);
    this.dataSourceService.listDatabases(input).subscribe({
      next: (result) => {
        this.sheetTesting.set(false);
        if (!result.success) {
          toast.error(result.message || 'Failed to list databases');
          return;
        }
        applyListedDatabases(this.store, dtoPath, result.databases);
        toast.success(
          result.databases.length === 1
            ? 'Connected — 1 database available'
            : `Connected — ${result.databases.length} databases available`,
        );
      },
      error: () => {
        this.sheetTesting.set(false);
        toast.error('Failed to list databases');
      },
    });
  }

  private loadDatabasesSilently() {
    if (!this.editingId) return;
    const updateDto = this.store.get<UpdateDataSourceDto>('updateDto');
    this.dataSourceService.listDatabases({ id: this.editingId, ...updateDto }).subscribe({
      next: (result) => {
        if (result.success) {
          applyListedDatabases(this.store, 'updateDto', result.databases);
        }
      },
      error: () => undefined,
    });
  }

  private onCreateSave() {
    const createDto = this.store.get<CreateDataSourceDto>('createDto');
    this.saving.set(true);
    this.dataSourceService.create(createDto).subscribe({
      next: () => {
        this.saving.set(false);
        this.closeSheet();
        this.loadDataSources();
        toast.success('Data source created successfully');
      },
      error: () => {
        this.saving.set(false);
        toast.error('Failed to create data source');
      },
    });
  }

  private onUpdateSave() {
    if (!this.editingId) return;
    const updateDto = this.store.get<UpdateDataSourceDto>('updateDto');
    const payload = { ...updateDto };
    if (!payload.password) {
      delete payload.password;
    }
    this.saving.set(true);
    this.dataSourceService.update(this.editingId, payload).subscribe({
      next: () => {
        this.saving.set(false);
        this.closeSheet();
        this.loadDataSources();
        toast.success('Data source updated successfully');
      },
      error: () => {
        this.saving.set(false);
        toast.error('Failed to update data source');
      },
    });
  }

  private closeSheet() {
    this.sheetRef?.close();
    this.sheetRef = null;
    this.editingId = null;
    this.saving.set(false);
    this.sheetTesting.set(false);
    this.sheetLoading.set(false);
  }

  // ── Delete / Test from the list ─────────────────────────────────────────────

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
        this.updateDataSourceStatus(ds.id, result.isActive);
        if (result.success) {
          toast.success(result.message);
        } else {
          toast.error(result.message);
        }
      },
      error: () => {
        this.testingId.set(null);
        this.updateDataSourceStatus(ds.id, false);
        toast.error('Connection test failed');
      },
    });
  }

  private updateDataSourceStatus(id: string, isActive: boolean) {
    const updated = this.dataSources().map((item) =>
      item.id === id ? { ...item, isActive } : item,
    );
    this.dataSources.set(updated);
    this.dataSources$.next(updated);
  }
}