import { authGuard } from '@/guards/auth.guard';
import { DashboardComponent } from '@/pages/auth/dashboard/dashboard.component';
import { LoginComponent } from '@/pages/auth/login.component';
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    canActivate: [authGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
  },
];
