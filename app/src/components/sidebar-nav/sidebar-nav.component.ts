import { Component, EventEmitter, Input, Output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { BrnSelectImports } from '@spartan-ng/brain/select';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideExternalLink } from '@ng-icons/lucide';
import { SidebarNavItem, SidebarNavSection } from './sidebar-nav.types';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar-nav',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ...HlmButtonImports,
    ...HlmBadgeImports,
    BrnSelectImports,
    HlmSelectImports,
    NgIconComponent,
  ],
  providers: [provideIcons({ lucideExternalLink })],
  templateUrl: 'sidebar-nav.component.html',
  styleUrl: 'sidebar-nav.component.css',
})
export class SidebarNavComponent {
  @Input() items: SidebarNavItem[] = [];
  @Input() sections?: SidebarNavSection[];
  @Input() activeHref?: string;

  @Output() onSelect = new EventEmitter<SidebarNavItem>();

  constructor(private router: Router) {}

  get flatItems(): SidebarNavItem[] {
    return this.sections ? this.sections.flatMap((s) => s.items) : this.items;
  }

  get normalizedPath(): string {
    if (this.activeHref) return this.activeHref;
    return this.router.url.split('?')[0].split('#')[0];
  }

  itemToString = (value: string): string => {
    const item = this.flatItems.find((i) => (i.href || i.id) === value);
    return item?.title ?? value?.toString() ?? '';
  };

  isActive(item: SidebarNavItem): boolean {
    const checkValue = item.href || item.id;
    return this.normalizedPath === checkValue;
  }

  handleNavigate(item: SidebarNavItem) {
    if (item.disabled) return;

    this.onSelect.emit(item);

    if (item.external && item.href) {
      window.open(item.href, '_blank', 'noopener,noreferrer');
    }
  }

  handleMobileSelect(value: string) {
    const targetItem = this.flatItems.find((i) => (i.href || i.id) === value);
    if (targetItem) {
      this.handleNavigate(targetItem);
    }
  }
}
