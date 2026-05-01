import { ChangeDetectionStrategy, Component } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideCommand } from '@ng-icons/lucide';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';
import { data } from '../data';
// import { NavProjectsComponent } from '../nav-projects/nav-projects.component';
import { NavSecondaryComponent } from '../nav-secondary/nav-secondary.component';
import { NavUserComponent } from '../nav-user/nav-user.component';
import { NavComponent } from '../nav/nav.component';
import { NavContextComponent } from '../nav-context/nav-context.component';

@Component({
  selector: 'app-sidebar',
  imports: [
    HlmSidebarImports,
    NavComponent,
    // NavProjectsComponent,
    NavUserComponent,
    NavSecondaryComponent,
    NavContextComponent,
  ],
  providers: [provideIcons({ lucideCommand })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  
})
export class SidebarComponent {
  public readonly data = data;
}
