import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy } from '@angular/core';
import { Table } from '@tanstack/angular-table';
import { DataTableServerQuery } from '../datatable-builder.types';

import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmToggleImports } from '@spartan-ng/helm/toggle';
import { Observable, of, Subscription } from 'rxjs';

@Component({
  selector: 'app-data-table-pagination',
  standalone: true,
  imports: [CommonModule, HlmToggleImports, HlmButtonImports],
  template: `
    <div class="flex flex-col justify-between gap-4 py-4 sm:flex-row sm:items-center">
      @if (sizes?.length) {
        <div class="flex flex-row gap-2">
          @for (size of sizes; track size) {
            <button
              hlmToggle
              type="button"
              [state]="currentPageSize === size ? 'on' : 'off'"
              (click)="setPageSize(size)"
            >
              {{ size }}
            </button>
          }
        </div>
      }

      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        <div class="text-muted-foreground text-sm">
          {{ selectedRowCount }} of {{ displayRowCount }} row(s) selected
        </div>

        <div class="flex items-center space-x-2">
          <button
            size="sm"
            variant="outline"
            hlmBtn
            [disabled]="!canPreviousPage"
            (click)="previousPage()"
            type="button"
          >
            Previous
          </button>

          <span class="text-muted-foreground min-w-28 text-center text-sm tabular-nums">
            Page {{ currentPage }} of {{ totalPages }}
          </span>

          <button
            size="sm"
            variant="outline"
            hlmBtn
            [disabled]="!canNextPage"
            (click)="nextPage()"
            type="button"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  `,
})
export class DataTablePagination<T> implements OnDestroy {
  private totalRecordsSub?: Subscription;
  private _totalRecords = 0;

  @Input() set totalRecords(value: Observable<number>) {
    this.totalRecordsSub?.unsubscribe();
    this.totalRecordsSub = (value ?? of(0)).subscribe((total) => {
      this._totalRecords = total ?? 0;
    });
  }

  @Input() sizes?: number[];
  @Input() table!: Table<T>;
  @Input() serverQuery?: DataTableServerQuery;

  ngOnDestroy(): void {
    this.totalRecordsSub?.unsubscribe();
  }

  get displayRowCount(): number {
    return this.serverQuery ? this._totalRecords : (this.table?.getRowCount() ?? 0);
  }

  get selectedRowCount(): number {
    return this.table?.getSelectedRowModel().rows.length ?? 0;
  }

  get currentPageSize(): number {
    return this.serverQuery
      ? this.serverQuery.pageSize()
      : (this.table?.getState().pagination.pageSize ?? this.sizes?.[0] ?? 10);
  }

  get currentPage(): number {
    if (this.serverQuery) {
      return this.serverQuery.page() + 1;
    }
    return (this.table?.getState().pagination.pageIndex ?? 0) + 1;
  }

  get totalPages(): number {
    if (this.serverQuery) {
      return Math.max(1, Math.ceil(this._totalRecords / this.serverQuery.pageSize()));
    }
    return Math.max(1, this.table?.getPageCount() ?? 1);
  }

  get canPreviousPage(): boolean {
    if (this.serverQuery) {
      return this.serverQuery.page() > 0;
    }
    return this.table?.getCanPreviousPage() ?? false;
  }

  get canNextPage(): boolean {
    if (this.serverQuery) {
      const totalPages = Math.ceil(this._totalRecords / this.serverQuery.pageSize());
      return this.serverQuery.page() < totalPages - 1;
    }
    return this.table?.getCanNextPage() ?? false;
  }

  setPageSize(size: number) {
    if (this.serverQuery) {
      this.serverQuery.setPageSize(size);
      this.serverQuery.setPage(0);
    } else {
      this.table?.setPageSize(size);
    }
  }

  previousPage() {
    if (this.serverQuery) {
      const currentPage = this.serverQuery.page();
      if (currentPage > 0) {
        this.serverQuery.setPage(currentPage - 1);
      }
    } else {
      this.table?.previousPage();
    }
  }

  nextPage() {
    if (this.serverQuery) {
      const totalPages = Math.ceil(this._totalRecords / this.serverQuery.pageSize());
      const currentPage = this.serverQuery.page();
      if (currentPage < totalPages - 1) {
        this.serverQuery.setPage(currentPage + 1);
      }
    } else {
      this.table?.nextPage();
    }
  }
}
