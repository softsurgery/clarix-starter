import { Component, effect, inject, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { BrnDialogRef } from '@spartan-ng/brain/dialog';
import { toast } from 'ngx-sonner';
import { DatatableBuilderComponent } from '@/components/datatable-builder/datatable-builder.component';
import { LayoutService } from '@/components/layout/layout.service';
import { SheetService } from '@/components/sheet/sheet.service';
import { DialogService } from '@/components/dialog/dialog.service';
import { createServerQuery } from '@/components/datatable-builder/server-query';
import { buildFindManyQuery } from '@/components/datatable-builder/find-many-query';
import {
  DataTableServerQuery,
  DynamicDataTable,
} from '@/components/datatable-builder/datatable-builder.types';
import type { CreateRoleDto, FindManyQueryDto, ResponseRoleDto, UpdateRoleDto } from '@/types';
import { RoleService } from './role.service';
import { RoleRepository } from '@/stores/role-state/role-state.repository';
import { getRoleDataTableObject } from './utils/role.data-table';
import { getRoleFormStructure } from './utils/role.form-structure';
import { getRoleSheet } from './utils/role.sheet';

@Component({
  selector: 'app-role',
  imports: [CommonModule, DatatableBuilderComponent],
  templateUrl: './role.component.html',
  styleUrl: './role.component.css',
})
export class RoleComponent implements OnInit, OnDestroy {
  private layoutService = inject(LayoutService);
  private roleService = inject(RoleService);
  private store = inject(RoleRepository);
  private sheetService = inject(SheetService);
  private dialogService = inject(DialogService);
  private vcr = inject(ViewContainerRef);

  private sheetRef: BrnDialogRef | null = null;
  private editingId: string | null = null;

  data = new BehaviorSubject<ResponseRoleDto[]>([]);
  totalRecords = new BehaviorSubject(0);
  serverQuery: DataTableServerQuery = createServerQuery({
    initialPageSize: 10,
    initialSortBy: 'updatedAt',
    initialSortOrder: 'desc',
  });

  dataTableObject: DynamicDataTable<ResponseRoleDto> = getRoleDataTableObject({
    onCreateAction: () => this.openCreateSheet(),
    onEditAction: (row) => this.openUpdateSheet(row),
    onDeleteAction: (row) => this.confirmDelete(row),
    serverQuery: this.serverQuery,
  });

  constructor() {
    effect(() => {
      this.loadRoles(buildFindManyQuery(this.serverQuery, {}, this.dataTableObject));
    });
  }

  ngOnInit() {
    this.layoutService.setBreadcrumbs([
      { label: 'User Management', url: '' },
      { label: 'Roles', url: '/roles' },
    ]);
    this.layoutService.setIntro('Roles', 'Manage user roles and access levels.');
  }

  ngOnDestroy() {
    this.layoutService.clearBreadcrumbs();
    this.layoutService.clearIntro();
  }

  loadRoles(query: FindManyQueryDto = {}) {
    this.roleService.findAllPaginated(query).subscribe((response) => {
      this.data.next(response.data);
      this.totalRecords.next(response.meta.itemCount);
    });
  }

  openCreateSheet() {
    this.editingId = null;
    this.store.reset();

    const structure = getRoleFormStructure({ store: this.store, mode: 'create' });
    this.sheetRef = this.sheetService.open(
      this.vcr,
      getRoleSheet({
        structure,
        mode: 'create',
        onSave: () => this.onCreateSave(),
        onCancel: () => this.closeSheet(),
      }),
    );
  }

  private onCreateSave() {
    const createDto = this.store.get<CreateRoleDto>('createDto');
    this.roleService.create(createDto).subscribe({
      next: () => {
        this.closeSheet();
        this.loadRoles();
        toast.success('Role created successfully');
      },
      error: () => toast.error('Failed to create role'),
    });
  }

  openUpdateSheet(row: ResponseRoleDto) {
    this.editingId = row.id;
    this.store.reset();
    this.store.set('updateDto', {
      label: row.label,
      description: row.description ?? '',
    });

    const structure = getRoleFormStructure({ store: this.store, mode: 'update' });
    this.sheetRef = this.sheetService.open(
      this.vcr,
      getRoleSheet({
        structure,
        mode: 'update',
        onSave: () => this.onUpdateSave(),
        onCancel: () => this.closeSheet(),
      }),
    );
  }

  private onUpdateSave() {
    if (!this.editingId) {
      return;
    }

    const updateDto = this.store.get<UpdateRoleDto>('updateDto');
    this.roleService.update(this.editingId, updateDto).subscribe({
      next: () => {
        this.closeSheet();
        this.loadRoles();
        toast.success('Role updated successfully');
      },
      error: () => toast.error('Failed to update role'),
    });
  }

  private closeSheet() {
    this.sheetRef?.close();
    this.sheetRef = null;
    this.editingId = null;
  }

  private confirmDelete(row: ResponseRoleDto) {
    const ref = this.dialogService.open(this.vcr, {
      title: 'Delete Role',
      description: `Are you sure you want to delete "${row.label}"?`,
      width: '400px',
      actions: [
        { label: 'Cancel', variant: 'outline', onClick: () => ref.close() },
        { label: 'Delete', variant: 'destructive', onClick: () => ref.close(true) },
      ],
    });

    ref.closed$.subscribe((confirmed) => {
      if (confirmed) {
        this.roleService.delete(row.id).subscribe({
          next: () => {
            this.loadRoles();
            toast.success('Role deleted successfully');
          },
          error: () => toast.error('Failed to delete role'),
        });
      }
    });
  }
}
