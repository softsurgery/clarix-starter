import { Routes } from '@angular/router';
import { HomeComponent } from '../pages/home/home.component';
import { LoginComponent } from '@/pages/auth/login.component';
import { UserComponent } from '@/pages/user/user.component';
import { RoleComponent } from '@/pages/role/role.component';
import { AgentComponent } from '@/pages/agent/agent.component';
import { DataSourcesComponent } from '@/pages/data-sources/data-sources.component';
import { CreateDataSourceComponent } from '@/pages/data-sources/create-data-source/create-data-source.component';
import { UpdateDataSourceComponent } from '@/pages/data-sources/update-data-source/update-data-source.component';
import { authGuard } from '@/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [authGuard],
  },
  {
    path: 'users',
    component: UserComponent,
    canActivate: [authGuard],
  },
  {
    path: 'roles',
    component: RoleComponent,
    canActivate: [authGuard],
  },
  {
    path: 'agent',
    component: AgentComponent,
    canActivate: [authGuard],
  },
  {
    path: 'data-sources',
    component: DataSourcesComponent,
    canActivate: [authGuard],
  },
  {
    path: 'data-sources/new',
    component: CreateDataSourceComponent,
    canActivate: [authGuard],
  },
  {
    path: 'data-sources/:id',
    component: UpdateDataSourceComponent,
    canActivate: [authGuard],
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];
