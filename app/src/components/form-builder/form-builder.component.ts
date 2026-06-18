import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { DynamicField, DynamicForm, DynamicGridItem } from './form-builder.types';
import { FormGroup } from '@angular/forms';
import { Subject, Observable, isObservable, of, combineLatest, map, takeUntil } from 'rxjs';
import { FieldBuilderComponent } from './field-builder/field-builder.component';

@Component({
  selector: 'app-form-builder',
  templateUrl: './form-builder.component.html',
  styleUrls: ['./form-builder.component.css'],
  standalone: true,
  imports: [CommonModule, FieldBuilderComponent],
})
export class FormBuilderComponent implements OnInit, OnDestroy {
  @Input() structure: DynamicForm = {
    title: '',
    description: '',
    class: '',
    grids: [],
  };

  @Output() formValueChange = new EventEmitter<any>();

  form!: FormGroup;
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.form = new FormGroup({});

    this.form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((values) => {
      this.formValueChange.emit(values);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Convert field's hidden state to observable
  isHidden(field: DynamicField): Observable<boolean> {
    if (isObservable(field.isHidden)) return field.isHidden;
    return of(!!field.isHidden);
  }

  // Check if row has at least one visible field
  private hasVisibleField(item: DynamicGridItem): Observable<boolean> {
    return combineLatest(item.fields.map((field) => this.isHidden(field))).pipe(
      map((hiddenStates) => hiddenStates.some((isHidden) => !isHidden)),
    );
  }

  // Filter all grid items to only those with at least one visible field
  filterVisibleRows(gridItems: DynamicGridItem[]): Observable<DynamicGridItem[]> {
    const rowObservables = gridItems.map((item) =>
      this.hasVisibleField(item).pipe(map((hasVisible) => (hasVisible ? item : null))),
    );

    return combineLatest(rowObservables).pipe(
      map((results) => results.filter((row) => row !== null) as DynamicGridItem[]),
    );
  }

  // Example: get filtered rows for a grid
  getFilteredRows(gridIndex: number): Observable<DynamicGridItem[]> {
    const grid = this.structure.grids[gridIndex];
    if (!grid) return of([]);
    return this.filterVisibleRows(grid.gridItems);
  }
}
