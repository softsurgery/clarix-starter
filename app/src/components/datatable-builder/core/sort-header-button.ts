import { Component, computed, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideArrowDown,
  lucideArrowUp,
  lucideChevronsUpDown,
} from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import {
  HeaderContext,
  injectFlexRenderContext,
} from '@tanstack/angular-table';

@Component({
  selector: 'app-table-head-sort-button',
  standalone: true,
  imports: [
    HlmButtonImports,
    HlmDropdownMenuImports,
    HlmIconImports,
    NgIcon,
  ],
  providers: [
    provideIcons({
      lucideChevronsUpDown,
      lucideArrowUp,
      lucideArrowDown,
    }),
  ],
  template: `
    <button
      hlmBtn
      size="sm"
      variant="ghost"
      [hlmDropdownMenuTrigger]="menu"
      [class.capitalize]="header() === ''"
      class="-ml-3"
    >
      <span class="font-bold">
        {{ _header() }}
      </span>

      <ng-icon
        hlm
        size="sm"
        name="lucideChevronsUpDown"
      />
    </button>

    <ng-template #menu>
      <hlm-dropdown-menu class="w-40">
        <button hlmDropdownMenuItem (click)="sortAsc()">
          <ng-icon name="lucideArrowUp" />
          Ascending
        </button>

        <button hlmDropdownMenuItem (click)="sortDesc()">
          <ng-icon name="lucideArrowDown" />
          Descending
        </button>
      </hlm-dropdown-menu>
    </ng-template>
  `,
})
export class TableHeadSortButton<T> {
  protected readonly _context =
    injectFlexRenderContext<HeaderContext<T, unknown>>();

  public readonly header = input('');

  protected readonly _header = computed(() =>
    this.header() === ''
      ? this._context.column.id
      : this.header()
  );

  protected sortAsc() {
    this._context.column.toggleSorting(false);
  }

  protected sortDesc() {
    this._context.column.toggleSorting(true);
  }
}