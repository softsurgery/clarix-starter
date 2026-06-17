import { Component, Input } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DynamicForm } from '../form-builder.types';
import { FormBuilderComponent } from '../form-builder.component';
import { CommonModule } from '@angular/common';
import { getFormBuilderObjectFactory } from './form-builder-factory';

@Component({
  selector: 'app-observable-form-builder-resolver',
  template: `<app-form-builder
    [structure]="(structure | async) || fallbackForm"
  ></app-form-builder>`,
  imports: [FormBuilderComponent, CommonModule],
})
export class ObservableFormBuilderResolverComponent {
  @Input() structure: Observable<DynamicForm> = of(getFormBuilderObjectFactory());

  fallbackForm: DynamicForm = getFormBuilderObjectFactory();
}
