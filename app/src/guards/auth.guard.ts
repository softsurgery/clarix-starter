import { Injectable, inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthPersistRepository } from '@/stores/auth-persist/auth-persist.repository';
import { map } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const authRepository = inject(AuthPersistRepository);
  const router = inject(Router);

  return authRepository.getObservable<boolean>('authenticated').pipe(
    map((authenticated) => {
      if (authenticated) {
        return true;
      } else {
        router.navigate(['/login']);
        return false;
      }
    }),
  );
};
