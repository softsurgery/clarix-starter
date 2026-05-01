import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideBookOpen,
  lucideBot,
  lucideChevronRight,
  lucideSettings2,
  lucideSquareTerminal,
  lucideHome,
  lucideWallet,
  lucideShoppingCart,
  lucideGrid,
  lucideShield,
  lucidePackage,
  lucideFolderTree,
  lucideFileText,
  lucideUsers,
  lucideBarChart,
  lucideBox,
  lucideSettings,
  lucideWebcam,
} from '@ng-icons/lucide';
import { HlmCollapsibleImports } from '@spartan-ng/helm/collapsible';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';

@Component({
  selector: 'app-nav',
  imports: [HlmSidebarImports, NgIcon, HlmCollapsibleImports, RouterLink],
  providers: [
    provideIcons({
      // Existing icons
      lucideSquareTerminal,
      lucideBot,
      lucideBookOpen,
      lucideSettings2,
      lucideChevronRight,
      lucideHome,
      lucideShield,
      lucideWallet,
      lucideShoppingCart,
      lucideGrid,
      lucidePackage,
      lucideFolderTree,
      lucideFileText,
      lucideUsers,
      lucideBarChart,
      lucideBox,
      lucideSettings,
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
      }[];
    }[]
  >();
}
