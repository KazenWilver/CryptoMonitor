import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';
import { I18nService } from '../../core/services/i18n.service';

@Component({
  selector: 'app-sidebar',
  template: `
    <aside class="sidebar" [class.collapsed]="collapsed">
      <div class="sidebar-header">
        <div class="logo" *ngIf="!collapsed">
          <span class="logo-icon">◈</span>
          <span class="logo-text">CryptoMonitor</span>
        </div>
        <button class="btn btn-icon btn-ghost toggle-btn" (click)="collapsed = !collapsed">
          <span>{{ collapsed ? '→' : '←' }}</span>
        </button>
      </div>

      <nav class="sidebar-nav">
        <a *ngFor="let item of navItems" [routerLink]="item.route" routerLinkActive="active"
           class="nav-item" [title]="item.label | translate">
          <span class="nav-icon">{{ item.icon }}</span>
          <span class="nav-label" *ngIf="!collapsed">{{ item.label | translate }}</span>
        </a>
        <a *ngIf="auth.isAdmin" routerLink="/admin" routerLinkActive="active"
           class="nav-item" title="Admin">
          <span class="nav-icon">⚙</span>
          <span class="nav-label" *ngIf="!collapsed">{{ 'nav.admin' | translate }}</span>
        </a>
      </nav>

      <div class="sidebar-footer">
        <button class="nav-item" (click)="theme.toggleTheme()">
          <span class="nav-icon">{{ theme.isDark ? '☀' : '🌙' }}</span>
          <span class="nav-label" *ngIf="!collapsed">{{ theme.isDark ? 'Light' : 'Dark' }}</span>
        </button>
        <button class="nav-item" (click)="toggleLang()">
          <span class="nav-icon">🌐</span>
          <span class="nav-label" *ngIf="!collapsed">{{ i18n.currentLang === 'pt' ? 'EN' : 'PT' }}</span>
        </button>
        <button class="nav-item logout" (click)="logout()">
          <span class="nav-icon">⏻</span>
          <span class="nav-label" *ngIf="!collapsed">{{ 'nav.logout' | translate }}</span>
        </button>
      </div>
    </aside>
  `,
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  collapsed = false;

  navItems = [
    { icon: '◉', label: 'nav.dashboard', route: '/dashboard' },
    { icon: '◎', label: 'nav.market', route: '/market' },
    { icon: '★', label: 'nav.watchlist', route: '/watchlist' },
    { icon: '◆', label: 'nav.portfolio', route: '/portfolio' },
    { icon: '⚡', label: 'nav.alerts', route: '/alerts' },
    { icon: '▤', label: 'nav.reports', route: '/reports' },
    { icon: '⚙', label: 'nav.settings', route: '/settings' },
  ];

  constructor(
    public auth: AuthService,
    public theme: ThemeService,
    public i18n: I18nService,
    private router: Router
  ) {}

  toggleLang(): void {
    this.i18n.setLanguage(this.i18n.currentLang === 'pt' ? 'en' : 'pt');
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/auth/login']);
  }
}
