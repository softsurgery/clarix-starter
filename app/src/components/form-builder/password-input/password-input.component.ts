import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormsModule } from '@angular/forms';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideEye, lucideEyeOff } from '@ng-icons/lucide';

@Component({
  selector: 'app-password-input',
  standalone: true,
  imports: [CommonModule, HlmInputImports, FormsModule, NgIconComponent],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PasswordInputComponent),
      multi: true,
    },
    provideIcons({ lucideEye, lucideEyeOff }),
  ],
  templateUrl: './password-input.component.html',
  styleUrls: ['./password-input.component.css'],
})
export class PasswordInputComponent implements ControlValueAccessor {
  @Input() placeholder: string = '';
  @Input() value: string = '';

  @Output() inputChange = new EventEmitter<string>();
  @Output() blurEvent = new EventEmitter<void>();

  showPassword = false;

  onChange: any = () => {};
  onTouched: any = () => {};

  writeValue(value: any): void {
    if (value !== undefined) {
      this.value = value;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    // Implement if needed
  }

  onInput(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.value = val;
    this.onChange(val);
    this.inputChange.emit(val);
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
