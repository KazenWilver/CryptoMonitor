import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { AdminGuard } from './core/guards/admin.guard';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./features/dashboard/dashboard.module').then(m => m.DashboardModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'market',
    loadChildren: () => import('./features/market/market.module').then(m => m.MarketModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'watchlist',
    loadChildren: () => import('./features/watchlist/watchlist.module').then(m => m.WatchlistModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'portfolio',
    loadChildren: () => import('./features/portfolio/portfolio.module').then(m => m.PortfolioModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'alerts',
    loadChildren: () => import('./features/alerts/alerts.module').then(m => m.AlertsModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'reports',
    loadChildren: () => import('./features/reports/reports.module').then(m => m.ReportsModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'settings',
    loadChildren: () => import('./features/settings/settings.module').then(m => m.SettingsModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.module').then(m => m.AdminModule),
    canActivate: [AuthGuard, AdminGuard]
  },
  { path: '**', redirectTo: '/dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
