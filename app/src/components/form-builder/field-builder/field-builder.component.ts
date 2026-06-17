import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  Injector,
  Input,
  ViewChild,
  ViewContainerRef,
  AfterViewInit,
  ChangeDetectorRef,
  Output,
  EventEmitter,
  OnInit,
  signal,
  OnDestroy,
} from '@angular/core';
import { DynamicField, SearchableSelectOption, SelectOption } from '../form-builder.types';
import { isObservable, map, Observable, of, Subject, takeUntil } from 'rxjs';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmSwitch } from '@spartan-ng/helm/switch';
import { HlmTextareaImports } from '@spartan-ng/helm/textarea';
import { BrnSelectImports } from '@spartan-ng/brain/select';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { PasswordInputComponent } from '../password-input/password-input.component';

@Component({
  selector: 'app-field-builder',
  templateUrl: './field-builder.component.html',
  styleUrls: ['./field-builder.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    HlmInputImports,
    HlmSwitch,
    HlmTextareaImports,
    PasswordInputComponent,
    BrnSelectImports,
    HlmSelectImports,
  ],
})
export class FieldBuilderComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() field!: DynamicField<any>;
  @Output() fieldBlur = new EventEmitter<void>();
  injector = inject(Injector);

  selectedValue?: string;

  @ViewChild('customComponentContainer', {
    read: ViewContainerRef,
    static: false,
  })
  viewContainerRef!: ViewContainerRef;

  options$ = of<SelectOption[]>([]);
  options = signal<SelectOption[]>([]);

  private destroy$ = new Subject<void>();
  private hasSearchable = false;

  itemToString = (value: any): string => {
    const option = this.options().find((opt) => opt.code === value);
    return option?.name ?? value?.toString() ?? '';
  };

  ngOnInit() {
    if (!this.field) return;

    const rawOptions = this.field.props?.['options'];

    const options$ = isObservable(rawOptions) ? rawOptions : of(rawOptions ?? []);

    this.options$ = options$.pipe(
      map((options) =>
        options
          .filter((opt: SelectOption) => !!opt?.name)
          .map((opt: SelectOption) => ({
            ...opt,
            name: opt.name,
          })),
      ),
    );

    this.options$.pipe(takeUntil(this.destroy$)).subscribe((options) => {
      this.options.set(options);
    });

    this.initSearchableDetection();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit() {
    if (this.field?.props?.['component']) {
      const componentType = this.field.props['component'];

      const componentRef = this.viewContainerRef.createComponent(componentType, {
        injector: this.injector,
      });

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { component, injectKeys, ...inputs } = this.field.props;

      for (const [key, value] of Object.entries(inputs)) {
        (componentRef.instance as any)[key] = value;
      }

      componentRef.changeDetectorRef.detectChanges();
    }
  }

  allowOnlyPhoneCharacters(event: KeyboardEvent) {
    const allowedChars = /[\d\\+\\-\\#\\*]/;
    if (!allowedChars.test(event.key)) {
      event.preventDefault();
    }
  }

  normalizeError(error: string | string[] | null | undefined): string[] {
    if (!error) return [];
    return Array.isArray(error) ? error : [error];
  }

  private initSearchableDetection(): void {
    const options: SearchableSelectOption[] | Observable<SearchableSelectOption[]> =
      this.field?.props?.['options'];

    if (!options || !isObservable(options)) {
      this.hasSearchable = Array.isArray(options)
        ? options.some((o: any) => !!o?.searchable)
        : false;
      return;
    }

    options.pipe(takeUntil(this.destroy$)).subscribe((opts: SearchableSelectOption[]) => {
      this.hasSearchable = opts?.some((o) => !!o?.searchable) ?? false;
    });
  }

  containsSearchableOption(): boolean {
    return this.hasSearchable;
  }

  onChangeHandler(field: any, event: any) {
    if (field.props && typeof field.props['onChange'] === 'function') {
      field.props['onChange'](event);
    }
  }

  onInputChange(event: Event) {
    const value = (event.target as HTMLInputElement | HTMLTextAreaElement).value;
    if (this.field.props && typeof this.field.props['onChange'] === 'function') {
      this.field.props['onChange'](value);
    }
  }

  onStringInputChange(value: string) {
    if (this.field.props && typeof this.field.props['onChange'] === 'function') {
      this.field.props['onChange'](value);
    }
  }

  onBlur() {
    if (this.field.props && typeof this.field.props['onBlur'] === 'function') {
      this.field.props['onBlur']();
    }
    this.fieldBlur.emit();
  }

  onSwitchChange(checked: boolean) {
    if (this.field.props && typeof this.field.props['onCheckedChange'] === 'function') {
      this.field.props['onCheckedChange'](checked);
    }
  }

  onSelectChange(selected: string | null) {
    if (!selected) return;

    this.selectedValue = selected;

    if (this.field.props && typeof this.field.props['onSelectChange'] === 'function') {
      this.field.props['onSelectChange'](selected);
    }
  }
}
