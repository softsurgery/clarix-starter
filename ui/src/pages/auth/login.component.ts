import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthPersistRepository } from '@/stores/auth-persist/auth-persist.repository';
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmButtonImports } from '@spartan-ng/helm/button';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, HlmLabelImports, HlmInputImports, HlmButtonImports],
  template: `
    <div class="flex items-center justify-center min-h-screen bg-background">
      <div class="w-full max-w-md p-8 bg-background rounded-lg shadow">
        <h2 class="text-2xl font-bold text-center mb-6">Login</h2>

        <form (ngSubmit)="onLogin()" class="space-y-4">
          <div>
            <label hlmLabel class="block mb-2">Username</label>
            <input
              hlmInput
              [(ngModel)]="username"
              name="username"
              type="text"
              placeholder="admin"
              class="w-full"
            />
          </div>

          <div>
            <label hlmLabel class="block mb-2">Password</label>
            <input
              hlmInput
              [(ngModel)]="password"
              name="password"
              type="password"
              placeholder="admin"
              class="w-full"
            />
          </div>

          <div *ngIf="errorMessage" class="text-red-500 text-sm mt-2">
            {{ errorMessage }}
          </div>

          <button hlmBtn type="submit" class="w-full">Login</button>
        </form>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class LoginComponent {
  private authRepository = inject(AuthPersistRepository);
  private router = inject(Router);

  username = '';
  password = '';
  errorMessage = '';

  onLogin(): void {
    if (this.username === 'admin' && this.password === 'admin') {
      this.authRepository.setState({ authenticated: true });
      this.router.navigate(['/tables']);
    } else {
      this.errorMessage = 'Invalid username or password';
    }
  }
}
