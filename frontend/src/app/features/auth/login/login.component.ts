import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  template: `
    <div class="auth-page">
      <div class="auth-card">
        <div class="auth-header">
          <span class="logo-icon">◈</span>
          <h3>CryptoMonitor</h3>
          <p class="text-muted">{{ 'auth.loginTitle' | translate }}</p>
        </div>

        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label>{{ 'auth.email' | translate }}</label>
            <input type="email" formControlName="email" placeholder="email@exemplo.com" />
          </div>

          <div class="form-group">
            <label>{{ 'auth.password' | translate }}</label>
            <input type="password" formControlName="password" placeholder="••••••" />
          </div>

          <div class="form-error" *ngIf="error">{{ error }}</div>

          <button type="submit" class="btn btn-primary btn-lg w-full" [disabled]="loading">
            <span class="spinner" *ngIf="loading"></span>
            {{ loading ? '' : ('auth.login' | translate) }}
          </button>
        </form>

        <div class="auth-footer">
          <a routerLink="/auth/register">{{ 'auth.noAccount' | translate }}</a>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  form: FormGroup;
  loading = false;
  error = '';

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = '';

    this.auth.login(this.form.value).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.error || 'Erro ao fazer login';
      }
    });
  }
}
