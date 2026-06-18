import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { provideIcons } from '@ng-icons/core';
import { lucideCommand } from '@ng-icons/lucide';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';
import { data } from '../data';
import { NavSecondaryComponent } from '../nav-secondary/nav-secondary.component';
import { NavUserComponent } from '../nav-user/nav-user.component';
import { NavComponent } from '../nav/nav.component';
import { NavContextComponent } from '../nav-context/nav-context.component';
import { AuthPersistRepository } from '@/stores/auth-persist/auth-persist.repository';
import { AuthUserDto } from '@/types';

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
  private readonly authRepository = inject(AuthPersistRepository);
  public readonly data = data;
  private readonly authUser = toSignal(this.authRepository.getObservable<AuthUserDto | null>('user'), {
    initialValue: null,
  });

  public readonly sidebarUser = computed(() => {
    const user = this.authUser();
    if (!user) {
      return data.user;
    }

    const displayName =
      user.firstName && user.lastName
        ? `${user.firstName} ${user.lastName}`
        : user.username;

    return {
      name: displayName,
      email: user.email,
      avatar: data.user.avatar,
    };
  });
}
