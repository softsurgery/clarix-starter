import { Component, effect, inject, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
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
import type { CreateUserDto, FindManyQueryDto, ResponseUserDto, UpdateUserDto } from '@/types';
import { UserService } from './user.service';
import { UserRepository } from '@/stores/user-state/user-state.repository';
import { RoleService } from '@/pages/role/role.service';
import { getUserDataTableObject } from './utils/user.data-table';
import {
  getUserCreateFormStructure,
  getUserUpdateFormStructure,
} from './utils/user.form-structure';
import { getUserCreateSheet, getUserUpdateSheet } from './utils/user.sheet';

@Component({
  selector: 'app-user',
  imports: [CommonModule, DatatableBuilderComponent],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css',
})
export class UserComponent implements OnInit, OnDestroy {
  private layoutService = inject(LayoutService);
  private userService = inject(UserService);
  private roleService = inject(RoleService);
  private store = inject(UserRepository);
  private sheetService = inject(SheetService);
  private dialogService = inject(DialogService);
  private vcr = inject(ViewContainerRef);

  private sheetRef: BrnDialogRef | null = null;
  private editingId: string | null = null;

  data = new BehaviorSubject<ResponseUserDto[]>([]);
  totalRecords = new BehaviorSubject(0);
  serverQuery: DataTableServerQuery = createServerQuery({
    initialPageSize: 10,
    initialSortBy: 'updatedAt',
    initialSortOrder: 'desc',
  });

  dataTableObject: DynamicDataTable<ResponseUserDto> = getUserDataTableObject({
    onCreateAction: () => this.openCreateSheet(),
    onEditAction: (row) => this.openUpdateSheet(row),
    onDeleteAction: (row) => this.confirmDelete(row),
    serverQuery: this.serverQuery,
  });

  constructor() {
    effect(() => {
      this.loadUsers(buildFindManyQuery(this.serverQuery, {}, this.dataTableObject));
    });
  }

  ngOnInit() {
    this.layoutService.setBreadcrumbs([
      { label: 'User Management', url: '' },
      { label: 'Users', url: '/users' },
    ]);
    this.layoutService.setIntro('Users', 'Manage system users and role assignments.');
  }

  ngOnDestroy() {
    this.layoutService.clearBreadcrumbs();
    this.layoutService.clearIntro();
  }

  loadUsers(query: FindManyQueryDto = {}) {
    this.userService.findAllPaginated(query).subscribe((response) => {
      this.data.next(response.data);
      this.totalRecords.next(response.meta.itemCount);
    });
  }

  private getRoleOptions$() {
    return this.roleService.findAll().pipe(
      map((roles) => roles.map((role) => ({ name: role.label, code: role.id }))),
    );
  }

  openCreateSheet() {
    this.editingId = null;
    this.store.reset();

    const structure = getUserCreateFormStructure({
      store: this.store,
      roles: this.getRoleOptions$(),
    });

    this.sheetRef = this.sheetService.open(
      this.vcr,
      getUserCreateSheet({
        structure,
        onSave: () => this.onCreateSave(),
        onCancel: () => this.closeSheet(),
      }),
    );
  }

  private onCreateSave() {
    const createDto = this.store.get<CreateUserDto>('createDto');
    this.userService.create(createDto).subscribe({
      next: () => {
        this.closeSheet();
        this.loadUsers();
        toast.success('User created successfully');
      },
      error: () => toast.error('Failed to create user'),
    });
  }

  openUpdateSheet(row: ResponseUserDto) {
    this.editingId = row.id;
    this.store.reset();
    this.store.set('updateDto', {
      username: row.username,
      email: row.email,
      firstName: row.firstName ?? '',
      lastName: row.lastName ?? '',
      password: '',
      roleId: row.roleId,
      isActive: row.isActive ?? true,
    });

    const structure = getUserUpdateFormStructure({
      store: this.store,
      roles: this.getRoleOptions$(),
    });

    this.sheetRef = this.sheetService.open(
      this.vcr,
      getUserUpdateSheet({
        structure,
        onSave: () => this.onUpdateSave(),
        onCancel: () => this.closeSheet(),
      }),
    );
  }

  private onUpdateSave() {
    if (!this.editingId) {
      return;
    }

    const updateDto = this.store.get<UpdateUserDto>('updateDto');
    const payload = { ...updateDto };
    if (!payload.password) {
      delete payload.password;
    }

    this.userService.update(this.editingId, payload).subscribe({
      next: () => {
        this.closeSheet();
        this.loadUsers();
        toast.success('User updated successfully');
      },
      error: () => toast.error('Failed to update user'),
    });
  }

  private closeSheet() {
    this.sheetRef?.close();
    this.sheetRef = null;
    this.editingId = null;
  }

  private confirmDelete(row: ResponseUserDto) {
    const ref = this.dialogService.open(this.vcr, {
      title: 'Delete User',
      description: `Are you sure you want to delete "${row.username}"?`,
      width: '400px',
      actions: [
        { label: 'Cancel', variant: 'outline', onClick: () => ref.close() },
        { label: 'Delete', variant: 'destructive', onClick: () => ref.close(true) },
      ],
    });

    ref.closed$.subscribe((confirmed) => {
      if (confirmed) {
        this.userService.delete(row.id).subscribe({
          next: () => {
            this.loadUsers();
            toast.success('User deleted successfully');
          },
          error: () => toast.error('Failed to delete user'),
        });
      }
    });
  }
}
