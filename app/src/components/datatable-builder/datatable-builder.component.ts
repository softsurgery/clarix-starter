import { Component, computed, Input } from '@angular/core';
import { DataTableVariant, DynamicDataTable } from './datatable-builder.types';
import { DatatableBuilderCommonComponent } from './datatable-builder-common/datatable-builder-common.component';
import { DatatableBuilderEditableComponent } from './datatable-builder-editable/datatable-builder-editable.component';
import { CommonModule } from '@angular/common';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-datatable-builder',
  templateUrl: './datatable-builder.component.html',
  styleUrls: ['./datatable-builder.component.css'],
  imports: [CommonModule, DatatableBuilderCommonComponent, DatatableBuilderEditableComponent],
})
export class DatatableBuilderComponent {
  @Input() dataTableObject?: DynamicDataTable;

  @Input() data: Observable<any[]> = of([]);
  @Input() totalRecords: Observable<number> = of(0);
  @Input() loading = false;

  isCommon = computed(() => {
    return this.dataTableObject?.variant == DataTableVariant.COMMON;
  });

  isEditable = computed(() => {
    return this.dataTableObject?.variant == DataTableVariant.EDITABLE;
  });
}
