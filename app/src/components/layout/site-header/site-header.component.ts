import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSearch } from '@ng-icons/lucide';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';
import { ModeToggleComponent } from '../mode-toggle/mode-toggle.component';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { LayoutService } from '../layout.service';
import { LucideAngularModule, Fullscreen } from 'lucide-angular';
import { HlmButton } from '@spartan-ng/helm/button';

@Component({
  selector: 'app-site-header',
  imports: [
    HlmSidebarImports,
    HlmSeparatorImports,
    HlmInputGroupImports,
    NgIcon,
    ModeToggleComponent,
    BreadcrumbComponent,
    LucideAngularModule,
    HlmButton,
  ],
  providers: [provideIcons({ lucideSearch })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './site-header.component.html',
  styleUrls: ['./site-header.component.css'],
})
export class SiteHeaderComponent {
  layoutService = inject(LayoutService);

  Fullscreen = Fullscreen;
}
