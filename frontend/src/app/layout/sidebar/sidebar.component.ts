import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';
import { I18nService } from '../../core/services/i18n.service';

@Component({
  selector: 'app-sidebar',
  standalone: false,
  template: `
    <aside class="sidebar" [class.collapsed]="collapsed">
      <div class="sidebar-header">
        <div class="logo" *ngIf="!collapsed">
          <span class="logo-icon pulse-glow">◈</span>
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
        <div class="lang-picker" *ngIf="!collapsed">
          <button class="nav-item" (click)="showLangMenu = !showLangMenu">
            <span class="nav-icon">🌐</span>
            <span class="nav-label">{{ getCurrentLangLabel() }}</span>
          </button>
          <div class="lang-menu" *ngIf="showLangMenu">
            <button *ngFor="let lang of languages"
                    class="lang-option"
                    [class.active]="i18n.currentLang === lang.code"
                    (click)="setLang(lang.code)">
              {{ lang.flag }} {{ lang.label }}
            </button>
          </div>
        </div>
        <button class="nav-item" *ngIf="collapsed" (click)="cycleLang()">
          <span class="nav-icon">🌐</span>
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
  showLangMenu = false;

  languages = [
    { code: 'pt', label: 'Português', flag: '🇧🇷' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'zh', label: '中文', flag: '🇨🇳' },
    { code: 'hi', label: 'हिन्दी', flag: '🇮🇳' },
    { code: 'ja', label: '日本語', flag: '🇯🇵' }
  ];

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

  getCurrentLangLabel(): string {
    return this.languages.find(l => l.code === this.i18n.currentLang)?.label || 'PT';
  }

  setLang(code: string): void {
    this.i18n.setLanguage(code);
    this.showLangMenu = false;
  }

  cycleLang(): void {
    const codes = this.languages.map(l => l.code);
    const idx = codes.indexOf(this.i18n.currentLang);
    this.i18n.setLanguage(codes[(idx + 1) % codes.length]);
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/auth/login']);
  }
}
