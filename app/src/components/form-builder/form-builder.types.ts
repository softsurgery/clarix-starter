import { Type } from '@angular/core';
import { Observable } from 'rxjs';

export interface DynamicForm {
  title: string;
  description?: string;
  class?: string;
  isHeaderHidden?: boolean;
  orientation?: 'vertical' | 'horizontal';
  grids: DynamicGrid[];
}

export interface DynamicGrid {
  title: string;
  description?: string;
  class?: string;
  isHeaderHidden?: boolean;
  gridItems: DynamicGridItem[];
}

export interface DynamicGridItem {
  fields: DynamicField[];
  class?: string;
  isHidden?: boolean;
}

export interface DynamicField<T = any> {
  id: string;
  label?: string;
  variant: FieldVariant;
  description?: string;
  class?: string;
  error?: Observable<string | string[]>;
  isRequired?: boolean;
  isDisabled?: Observable<boolean>;
  isHidden?: boolean | Observable<boolean>;
  props?: Partial<T>;
}

export enum FieldVariant {
  TEXT = 'text',
  EMAIL = 'email',
  TEL = 'tel',
  NUMBER = 'number',
  PASSWORD = 'password',
  SWITCH = 'switch',
  TEXTAREA = 'textarea',
  CUSTOM = 'custom',
  EMPTY = 'empty',
  SELECT = 'select',
}

export interface BaseFieldProps {
  value: Observable<any>;
  onChange: (event: any) => void;
  onBlur?: () => void;
}

export interface TextFieldProps extends BaseFieldProps {
  placeholder?: string;
}

export interface EmailFieldProps extends BaseFieldProps {
  placeholder?: string;
}

export interface TelFieldProps extends BaseFieldProps {
  placeholder?: string;
}

export interface NumberFieldProps extends BaseFieldProps {
  placeholder?: string;
  mode?: 'decimal' | 'currency';
  minFractionDigits?: number;
  maxFractionDigits?: number;
  min?: number;
  max?: number;
}

export interface PasswordFieldProps extends BaseFieldProps {
  placeholder?: string;
}

export interface DateFieldProps extends BaseFieldProps {
  view: 'date' | 'month' | 'year';
  format?: string;
  minDate?: Date;
  lastDate?: Date;
  showTime?: boolean;
  placeholder?: string;
}

export interface TextareaFieldProps extends BaseFieldProps {
  placeholder?: string;
  rows?: number;
  cols?: number;
  resize?: 'none' | 'allow';
}

export interface SelectOption {
  name?: string;
  code?: string | number;
}

export interface SearchableSelectOption extends SelectOption {
  searchable?: string;
}

export interface SelectFieldProps {
  value?: Observable<string>;
  placeholder?: string;
  options?: SelectOption[] | Observable<SelectOption[]>;
  onSelectChange?: (event: string) => void;
  onBlur?: () => void;
  filterEnabled?: boolean;
  showClear?: boolean;
}

export interface MultiSelectFieldProps {
  placeholder?: string;
  options?: SelectOption[] | Observable<SelectOption[]>;
  value?: Observable<SelectOption[]>;
  onSelectChange?: (event: SelectOption[]) => void;
}

export interface CheckboxFieldProps {
  breakline?: boolean;
  placeholder?: string;
  options?: SelectOption[];
  values?: Observable<string[]>;
  onCheckChange?: (event: string[]) => void;
}

export interface RadioFieldProps {
  name?: string;
  options?: SelectOption[];
  value?: Observable<SelectOption | undefined | string>;
  onChange?: (event: SelectOption) => void;
}

export interface EditorFieldProps extends BaseFieldProps {
  placeholder?: string;
  height?: string;
}

export interface SwitchFieldProps {
  checked?: Observable<boolean>;
  onCheckedChange?: (event: boolean) => void;
}

export interface CustomFieldProps {
  component?: Type<any>;
  [key: string]: any;
  injectKeys?: string[];
}
