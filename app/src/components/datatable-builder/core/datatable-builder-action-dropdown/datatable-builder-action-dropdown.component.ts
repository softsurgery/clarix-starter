import { Component, Input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideEllipsis } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { CellContext, injectFlexRenderContext } from '@tanstack/angular-table';
import { DataTableAction, DataTableRowActions } from '../../datatable-builder.types';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-datatable-builder-action-dropdown',
  imports: [CommonModule, HlmButtonImports, NgIcon, HlmIconImports, HlmDropdownMenuImports],
  providers: [provideIcons({ lucideEllipsis })],
  templateUrl: './datatable-builder-action-dropdown.component.html',
  styleUrls: ['./datatable-builder-action-dropdown.component.css'],
})
export class DatatableBuilderActionDropdownComponent {
  @Input() rowActions?: DataTableRowActions;
  @Input() rowActionsFn?: (row: any) => DataTableRowActions;

  readonly context = injectFlexRenderContext<CellContext<any, unknown>>();

  /** Prioritize rowActionsFn over rowActions */
  get resolvedActions(): DataTableRowActions | undefined {
    if (this.rowActionsFn) {
      return this.rowActionsFn(this.context.row.original);
    }
    return this.rowActions;
  }

  get additionalActionEntries(): { groupLabel: string; actions: DataTableAction[] }[] {
    const additional = this.resolvedActions?.additionalActions;
    if (!additional) return [];
    return Object.entries(additional)
      .filter(([, actions]) => actions && actions.length > 0)
      .map(([groupLabel, actions]) => ({ groupLabel, actions: actions! }));
  }

  executeAction(action: DataTableAction) {
    action.action?.(this.context.row.original);
  }
}
