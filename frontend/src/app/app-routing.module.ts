import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { AdminGuard } from './core/guards/admin.guard';
import { LayoutComponent } from './layout/layout.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./features/dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'market',
        loadChildren: () => import('./features/market/market.module').then(m => m.MarketModule)
      },
      {
        path: 'watchlist',
        loadChildren: () => import('./features/watchlist/watchlist.module').then(m => m.WatchlistModule)
      },
      {
        path: 'portfolio',
        loadChildren: () => import('./features/portfolio/portfolio.module').then(m => m.PortfolioModule)
      },
      {
        path: 'alerts',
        loadChildren: () => import('./features/alerts/alerts.module').then(m => m.AlertsModule)
      },
      {
        path: 'reports',
        loadChildren: () => import('./features/reports/reports.module').then(m => m.ReportsModule)
      },
      {
        path: 'settings',
        loadChildren: () => import('./features/settings/settings.module').then(m => m.SettingsModule)
      },
      {
        path: 'admin',
        loadChildren: () => import('./features/admin/admin.module').then(m => m.AdminModule),
        canActivate: [AdminGuard]
      }
    ]
  },
  { path: '**', redirectTo: '/dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
