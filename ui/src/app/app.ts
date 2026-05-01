import { AuthPersistRepository } from '@/stores/auth-persist/auth-persist.repository';
import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { map } from 'rxjs';
import { HlmToasterImports } from '@spartan-ng/helm/sonner';
import LayoutComponent from '../components/layout/layout.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LayoutComponent, HlmToasterImports],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  private authRepository = inject(AuthPersistRepository);
  protected readonly isAuthenticated = signal(false);

  ngOnInit() {
    this.authRepository
      .getObservable<boolean>('authenticated')
      .pipe(map((auth) => auth || false))
      .subscribe((isAuth) => {
        this.isAuthenticated.set(isAuth);
      });
  }
}
