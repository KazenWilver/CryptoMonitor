import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';
import { I18nService } from '../../core/services/i18n.service';

@Component({
  selector: 'app-settings',
  standalone: false,
  template: `
    <div class="page-header">
      <h3 class="page-title">{{ 'settings.title' | translate }}</h3>
    </div>

    <div class="settings-grid">
      <!-- Profile -->
      <div class="card card-hover-glow animate-fadeIn">
        <h5 class="mb-16">👤 {{ 'settings.profile' | translate }}</h5>
        <div class="form-group">
          <label>{{ 'auth.name' | translate }}</label>
          <input type="text" [(ngModel)]="profile.name" placeholder="Ex: João Silva" />
        </div>
        <div class="form-group">
          <label>{{ 'auth.email' | translate }}</label>
          <input type="email" [(ngModel)]="profile.email" placeholder="email@exemplo.com" />
        </div>
        <button class="btn btn-primary mt-8" (click)="saveProfile()">{{ 'settings.save' | translate }}</button>
        <div class="form-success mt-8" *ngIf="profileMsg">{{ profileMsg }}</div>
      </div>

      <!-- Preferences -->
      <div class="card card-hover-glow animate-fadeIn" style="animation-delay:0.1s">
        <h5 class="mb-16">🎨 {{ 'settings.preferences' | translate }}</h5>
        <div class="form-group">
          <label>{{ 'settings.theme' | translate }}</label>
          <div class="flex gap-8">
            <button class="btn btn-sm" [class.btn-primary]="theme.isDark" [class.btn-ghost]="!theme.isDark" (click)="theme.setTheme('dark')">
              🌙 {{ 'settings.darkMode' | translate }}
            </button>
            <button class="btn btn-sm" [class.btn-primary]="!theme.isDark" [class.btn-ghost]="theme.isDark" (click)="theme.setTheme('light')">
              ☀ {{ 'settings.lightMode' | translate }}
            </button>
          </div>
        </div>
        <div class="form-group">
          <label>{{ 'settings.language' | translate }}</label>
          <div class="flex gap-8" style="flex-wrap:wrap">
            <button *ngFor="let lang of languages" class="btn btn-sm"
                    [class.btn-primary]="i18n.currentLang === lang.code"
                    [class.btn-ghost]="i18n.currentLang !== lang.code"
                    (click)="i18n.setLanguage(lang.code)">
              {{ lang.flag }} {{ lang.label }}
            </button>
          </div>
        </div>
      </div>

      <!-- Password -->
      <div class="card card-hover-glow animate-fadeIn" style="animation-delay:0.2s">
        <h5 class="mb-16">🔒 {{ 'settings.changePassword' | translate }}</h5>
        <div class="form-group">
          <label>{{ 'settings.currentPassword' | translate }}</label>
          <input type="password" [(ngModel)]="pw.current" placeholder="••••••••" />
        </div>
        <div class="form-group">
          <label>{{ 'settings.newPassword' | translate }}</label>
          <input type="password" [(ngModel)]="pw.newPw" placeholder="Mínimo 6 caracteres" />
        </div>
        <button class="btn btn-primary mt-8" (click)="changePassword()">{{ 'settings.save' | translate }}</button>
        <div class="form-success mt-8" *ngIf="pwMsg">{{ pwMsg }}</div>
      </div>
    </div>
  `,
  styles: [`
    .settings-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 16px; }
  `]
})
export class SettingsComponent implements OnInit {
  profile: any = {};
  pw = { current: '', newPw: '' };
  profileMsg = '';
  pwMsg = '';
  languages = [
    { code: 'pt', label: 'PT', flag: '🇧🇷' },
    { code: 'en', label: 'EN', flag: '🇬🇧' },
    { code: 'es', label: 'ES', flag: '🇪🇸' },
    { code: 'fr', label: 'FR', flag: '🇫🇷' },
    { code: 'zh', label: '中文', flag: '🇨🇳' },
    { code: 'hi', label: 'हिन्दी', flag: '🇮🇳' },
    { code: 'ja', label: '日本語', flag: '🇯🇵' }
  ];

  constructor(
    private http: HttpClient,
    public auth: AuthService,
    public theme: ThemeService,
    public i18n: I18nService
  ) {}

  ngOnInit(): void {
    this.profile = { name: this.auth.currentUser?.name, email: this.auth.currentUser?.email };
  }

  saveProfile(): void {
    this.http.put<any>(`${environment.apiUrl}/api/user/profile`, this.profile).subscribe({
      next: (res) => { this.profileMsg = res.message || 'Salvo!'; if (res.data) this.auth.updateUser(res.data); },
      error: (err) => { this.profileMsg = err.error?.error || 'Erro'; }
    });
  }

  changePassword(): void {
    this.http.put<any>(`${environment.apiUrl}/api/user/password`, {
      current_password: this.pw.current, new_password: this.pw.newPw
    }).subscribe({
      next: (res) => { this.pwMsg = res.message || 'Password alterada!'; this.pw = { current: '', newPw: '' }; },
      error: (err) => { this.pwMsg = err.error?.error || 'Erro'; }
    });
  }
}
