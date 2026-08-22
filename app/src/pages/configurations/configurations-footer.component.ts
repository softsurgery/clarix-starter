import { Component, Input, Signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HlmButtonImports } from '@spartan-ng/helm/button';

@Component({
  selector: 'app-configurations-footer',
  standalone: true,
  imports: [CommonModule, ...HlmButtonImports],
  template: `
    <div class="flex justify-end gap-3 p-4 border-t bg-background">
      <button hlmBtn variant="outline" (click)="onTest()" [disabled]="isSaving() || isTesting()">
        @if (isTesting()) {
          Testing...
        } @else {
          Test Ollama
        }
      </button>
      <button hlmBtn (click)="onSave()" [disabled]="isSaving() || isTesting()">
        @if (isSaving()) {
          Saving...
        } @else {
          Save Configurations
        }
      </button>
    </div>
  `,
})
export class ConfigurationsFooterComponent {
  @Input() saving!: Signal<boolean>;
  @Input() testing!: Signal<boolean>;
  @Input() onTest!: () => void;
  @Input() onSave!: () => void;

  isSaving = computed(() => (this.saving ? this.saving() : false));
  isTesting = computed(() => (this.testing ? this.testing() : false));
}
