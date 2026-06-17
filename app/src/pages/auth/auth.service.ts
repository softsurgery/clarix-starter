import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import type { AuthUserDto, LoginCredentials } from '@/types';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  login(credentials: LoginCredentials): Observable<AuthUserDto | null> {
    return from(window.electronAPI!.auth.login(credentials));
  }
}
