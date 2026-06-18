import { Component, input } from '@angular/core';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { type BadgeVariants } from '../../../../libs/ui/badge/src/lib/hlm-badge';
import { type CellContext, injectFlexRenderContext } from '@tanstack/angular-table';

@Component({
  imports: [HlmBadgeImports],
  template: `
    <span hlmBadge [variant]="variant()" class="capitalize">{{ value() }}</span>
  `,
})
export class DataTableBadgeCell<T> {
  protected readonly _context = injectFlexRenderContext<CellContext<T, unknown>>();
  public readonly variant = input<BadgeVariants['variant']>('default');
  public readonly value = input<string>('');
}
