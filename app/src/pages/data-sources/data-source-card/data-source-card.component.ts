import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucidePencil,
  lucideTrash2,
  lucideShieldCheck,
  lucideShieldOff,
  lucideZap,
  lucideMoreVertical,
} from '@ng-icons/lucide';
import type { ResponseDataSourceDto } from '@/types';

@Component({
  selector: 'app-data-source-card',
  standalone: true,
  imports: [
    CommonModule,
    ...HlmButtonImports,
    ...HlmIconImports,
    ...HlmBadgeImports,
    ...HlmDropdownMenuImports,
    NgIcon,
  ],
  providers: [
    provideIcons({
      lucidePencil,
      lucideTrash2,
      lucideShieldCheck,
      lucideShieldOff,
      lucideZap,
      lucideMoreVertical,
    }),
  ],
  templateUrl: `data-source-card.component.html`,
})
export class DataSourceCardComponent {
  ds = input.required<ResponseDataSourceDto>();
  isTesting = input<boolean>(false);

  edit = output<ResponseDataSourceDto>();
  delete = output<ResponseDataSourceDto>();
  test = output<ResponseDataSourceDto>();

  private DB_LABELS: Record<string, string> = {
    postgresql: 'PostgreSQL',
    mysql: 'MySQL',
    mariadb: 'MariaDB',
    oracle: 'Oracle',
  };

  getTypeLabel(type: string): string {
    return this.DB_LABELS[type] ?? type;
  }
}
