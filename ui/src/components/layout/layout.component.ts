import { ChangeDetectionStrategy, Component, inject, ViewEncapsulation } from '@angular/core';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { SiteHeaderComponent } from './site-header/site-header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { CommonModule, NgComponentOutlet } from '@angular/common';
import { LayoutService } from './layout.service';

@Component({
  selector: 'app-layout',
  imports: [
    CommonModule,
    NgComponentOutlet,
    HlmSidebarImports,
    HlmSeparatorImports,
    SiteHeaderComponent,
    SidebarComponent,
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block [--header-height:--spacing(14)]',
  },
  styleUrl: './layout.component.css',
  templateUrl: './layout.component.html',
})
export default class LayoutComponent {
  protected readonly layoutService = inject(LayoutService);
}
