import { Routes } from '@angular/router';
import { HomeComponent } from '../pages/home/home.component';
import { LoginComponent } from '@/pages/auth/login.component';
import { UserComponent } from '@/pages/user/user.component';
import { RoleComponent } from '@/pages/role/role.component';
import { QAComponent } from '@/pages/qa/qa.component';
import { DataSourcesComponent } from '@/pages/data-sources/data-sources.component';
import { CreateDataSourceComponent } from '@/pages/data-sources/create-data-source/create-data-source.component';
import { UpdateDataSourceComponent } from '@/pages/data-sources/update-data-source/update-data-source.component';
import { authGuard } from '@/guards/auth.guard';
import { ChartsComponent } from '@/pages/charts/charts.component';
import { ChartsHistoryComponent } from '@/pages/charts/charts-history/charts-history.component';
import { QAHistoryComponent } from '@/pages/qa/qa-history/qa-history.component';
import { QAHistoryDetailComponent } from '@/pages/qa/qa-history/qa-history-detail.component';
import { ModelTestComponent } from '@/pages/model-test/model-test.component';
import { ConfigurationsComponent } from '@/pages/configurations/configurations.component';

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
    path: 'agent/history/:id',
    component: QAHistoryDetailComponent,
    canActivate: [authGuard],
  },
  {
    path: 'agent/history',
    component: QAHistoryComponent,
    canActivate: [authGuard],
  },
  {
    path: 'agent',
    component: QAComponent,
    canActivate: [authGuard],
  },
  {
    path: 'model-test',
    component: ModelTestComponent,
    canActivate: [authGuard],
  },
  {
    path: 'configurations',
    component: ConfigurationsComponent,
    canActivate: [authGuard],
  },
  {
    path: 'agent-charts',
    component: ChartsComponent,
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
    path: 'logging',
    children: [
      {
        path: 'qa',
        component: QAHistoryComponent,
      },
      {
        path: 'charts',
        component: ChartsHistoryComponent,
      },
    ],
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];
