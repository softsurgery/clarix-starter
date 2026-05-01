import { AuthPersistRepository } from '@/stores/auth-persist/auth-persist.repository';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideBadgeCheck,
  lucideBell,
  lucideChevronsUpDown,
  lucideCreditCard,
  lucideLogOut,
  lucideSparkles,
} from '@ng-icons/lucide';
import { HlmAvatarImports } from '@spartan-ng/helm/avatar';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmSidebarImports, HlmSidebarService } from '@spartan-ng/helm/sidebar';

@Component({
  selector: 'app-nav-user',
  imports: [HlmSidebarImports, HlmAvatarImports, NgIcon, HlmDropdownMenuImports],
  providers: [
    provideIcons({
      lucideChevronsUpDown,
      lucideSparkles,
      lucideBadgeCheck,
      lucideCreditCard,
      lucideBell,
      lucideLogOut,
    }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './nav-user.component.html',
  styleUrls: ['./nav-user.component.css'],
})
export class NavUserComponent {
  authPersistRepository = inject(AuthPersistRepository);
  private readonly _sidebarService = inject(HlmSidebarService);
  protected readonly _menuSide = computed(() =>
    this._sidebarService.isMobile() ? 'top' : 'right',
  );

  public readonly user = input.required<{
    name: string;
    email: string;
    avatar: string;
  }>();

  logout(): void {
    this.authPersistRepository.set('authenticated', false);
    window.location.reload();
  }
}
