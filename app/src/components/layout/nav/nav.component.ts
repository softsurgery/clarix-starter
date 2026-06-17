import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import * as lucideIcons from '@ng-icons/lucide';
import { HlmCollapsibleImports } from '@spartan-ng/helm/collapsible';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';

@Component({
  selector: 'app-nav',
  imports: [HlmSidebarImports, NgIcon, HlmCollapsibleImports, RouterLink, RouterLinkActive],
  providers: [
    provideIcons({
      ...lucideIcons,
    }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent {
  public readonly items = input.required<
    {
      title: string;
      url?: string;
      icon: string;
      isActive?: boolean;
      items?: {
        title: string;
        url: string;
        icon?: string;
      }[];
    }[]
  >();
}
