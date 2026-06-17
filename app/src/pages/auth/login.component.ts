import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthPersistRepository } from '@/stores/auth-persist/auth-persist.repository';
import { AuthService } from './auth.service';
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmButtonImports } from '@spartan-ng/helm/button';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, HlmLabelImports, HlmInputImports, HlmButtonImports],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  private authRepository = inject(AuthPersistRepository);
  private authService = inject(AuthService);
  private router = inject(Router);

  username = '';
  password = '';
  errorMessage = '';

  onLogin(): void {
    this.errorMessage = '';
    this.authService
      .login({ usernameOrEmail: this.username, password: this.password })
      .subscribe({
        next: (user) => {
          if (!user) {
            this.errorMessage = 'Invalid username or password';
            return;
          }
          this.authRepository.setState({ authenticated: true, user });
          this.router.navigate(['/home']);
        },
        error: () => {
          this.errorMessage = 'Invalid username or password';
        },
      });
  }
}
