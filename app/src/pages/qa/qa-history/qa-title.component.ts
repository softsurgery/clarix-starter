import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideHistory } from '@ng-icons/lucide';

@Component({
  selector: 'app-qa-title',
  standalone: true,
  imports: [CommonModule, RouterLink, ...HlmButtonImports, ...HlmIconImports, NgIcon],
  viewProviders: [provideIcons({ lucideHistory })],
  template: `
    <div class="flex items-center gap-2">
      <a hlmBtn variant="ghost" size="sm" class="gap-1.5" routerLink="/agent/history">
        <ng-icon name="lucideHistory" hlmIcon class="size-5" />
      </a>
    </div>
  `,
})
export class QATitleComponent {}
