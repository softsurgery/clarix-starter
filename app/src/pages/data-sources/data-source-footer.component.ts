import { Component, Input, Signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HlmButtonImports } from '@spartan-ng/helm/button';

@Component({
  selector: 'app-data-source-footer',
  standalone: true,
  imports: [CommonModule, ...HlmButtonImports],
  template: `
    <div class="flex justify-end gap-3 p-4 border-t bg-background">
      <button hlmBtn variant="outline" (click)="onTest()" [disabled]="isSaving() || isTesting()">
        @if (isTesting()) {
          Loading databases...
        } @else {
          Test Connection
        }
      </button>
      <button hlmBtn (click)="onSave()" [disabled]="isSaving() || isLoading() || isTesting()">
        @if (isSaving()) {
          Saving...
        } @else {
          {{ submitLabel }}
        }
      </button>
    </div>
  `,
})
export class DataSourceFooterComponent {
  @Input() saving!: Signal<boolean>;
  @Input() loading?: Signal<boolean>;
  @Input() testing?: Signal<boolean>;
  @Input() submitLabel: string = 'Save';
  @Input() onTest!: () => void;
  @Input() onSave!: () => void;

  isSaving = computed(() => (this.saving ? this.saving() : false));
  isLoading = computed(() => (this.loading ? this.loading() : false));
  isTesting = computed(() => (this.testing ? this.testing() : false));
}
