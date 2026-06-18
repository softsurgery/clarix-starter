import { Component, inject, Input, ViewContainerRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideHistory } from '@ng-icons/lucide';
import { SheetService } from '@/components/sheet/sheet.service';
import { QAHistoryComponent } from './qa-history.component';

@Component({
  selector: 'app-qa-title',
  standalone: true,
  imports: [CommonModule, ...HlmButtonImports, ...HlmIconImports, NgIcon],
  viewProviders: [provideIcons({ lucideHistory })],
  template: `
    <div class="flex items-center gap-2">
      <button hlmBtn variant="outline" size="sm" class="gap-1.5" (click)="openHistory()">
        <ng-icon name="lucideHistory" hlmIcon size="sm" />
        History
      </button>
    </div>
  `,
})
export class QATitleComponent {
  @Input() onHistoryOpened?: () => void;

  private sheetService = inject(SheetService);
  private vcr = inject(ViewContainerRef);

  openHistory() {
    this.sheetService.open(this.vcr, {
      title: 'Session History',
      description: 'Browse past Q&A sessions and their execution logs.',
      position: 'right',
      width: '75vw',
      component: {
        outlet: QAHistoryComponent,
        props: {},
      },
    });

    this.onHistoryOpened?.();
  }
}
