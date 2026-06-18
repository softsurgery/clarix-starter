import { Component, Input, Signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideLayoutGrid, lucideList } from '@ng-icons/lucide';

@Component({
  selector: 'app-data-sources-title',
  standalone: true,
  imports: [CommonModule, ...HlmButtonImports, ...HlmIconImports, NgIcon],
  viewProviders: [provideIcons({ lucideLayoutGrid, lucideList })],
  template: `
    <div class="flex items-center gap-3">
      @if (hasDataSourcesComputed()) {
        <div class="flex items-center border rounded-lg p-1 bg-muted/40 shrink-0">
          <button
            hlmBtn
            variant="ghost"
            size="icon"
            class="h-8 w-8 rounded-md"
            [class.bg-background]="viewModeComputed() === 'grid'"
            [class.shadow-xs]="viewModeComputed() === 'grid'"
            (click)="onSetViewMode('grid')"
            title="Grid View"
          >
            <ng-icon name="lucideLayoutGrid" hlmIcon size="sm" />
          </button>
          <button
            hlmBtn
            variant="ghost"
            size="icon"
            class="h-8 w-8 rounded-md"
            [class.bg-background]="viewModeComputed() === 'list'"
            [class.shadow-xs]="viewModeComputed() === 'list'"
            (click)="onSetViewMode('list')"
            title="List View"
          >
            <ng-icon name="lucideList" hlmIcon size="sm" />
          </button>
        </div>
      }
    </div>
  `,
})
export class DataSourcesTitleComponent {
  @Input() viewMode!: Signal<'grid' | 'list'>;
  @Input() setViewMode!: (mode: 'grid' | 'list') => void;
  @Input() hasDataSources!: Signal<boolean>;

  viewModeComputed = computed(() => (this.viewMode ? this.viewMode() : 'grid'));
  hasDataSourcesComputed = computed(() => (this.hasDataSources ? this.hasDataSources() : false));

  onSetViewMode(mode: 'grid' | 'list') {
    if (this.setViewMode) {
      this.setViewMode(mode);
    }
  }
}
