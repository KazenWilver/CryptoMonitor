import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: false,
  template: `
    <div class="auth-page">
      <div class="auth-card" [class.shake]="shakeError">
        <div class="auth-header">
          <span class="logo-icon pulse-glow">◈</span>
          <h3>CryptoMonitor</h3>
          <p class="text-muted">{{ 'auth.loginTitle' | translate }}</p>
        </div>

        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label>{{ 'auth.email' | translate }}</label>
            <input type="email" formControlName="email" placeholder="email@exemplo.com"
                   [class.input-error]="form.get('email')?.invalid && form.get('email')?.touched" />
            <div class="form-error" *ngIf="form.get('email')?.hasError('required') && form.get('email')?.touched">
              Email é obrigatório
            </div>
            <div class="form-error" *ngIf="form.get('email')?.hasError('email') && form.get('email')?.touched">
              Email inválido
            </div>
          </div>

          <div class="form-group">
            <label>{{ 'auth.password' | translate }}</label>
            <input type="password" formControlName="password" placeholder="••••••"
                   [class.input-error]="form.get('password')?.invalid && form.get('password')?.touched" />
            <div class="form-error" *ngIf="form.get('password')?.hasError('required') && form.get('password')?.touched">
              Password é obrigatória
            </div>
            <div class="form-error" *ngIf="form.get('password')?.hasError('minlength') && form.get('password')?.touched">
              Mínimo 6 caracteres
            </div>
          </div>

          <div class="form-error login-error" *ngIf="error">
            <span class="error-icon">✕</span> {{ error }}
          </div>

          <button type="submit" class="btn btn-primary btn-lg w-full" [disabled]="loading">
            <span class="spinner" *ngIf="loading"></span>
            {{ loading ? '' : ('auth.login' | translate) }}
          </button>
        </form>

        <div class="auth-footer" style="display: flex; flex-direction: column; gap: 10px;">
          <a routerLink="/auth/forgot-password">{{ 'auth.forgotPassword' | translate }}</a>
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
  shakeError = false;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.triggerShake();
      return;
    }
    this.loading = true;
    this.error = '';

    this.auth.login(this.form.value).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.error || 'Email ou password incorretos';
        this.triggerShake();
      }
    });
  }

  private triggerShake(): void {
    this.shakeError = true;
    setTimeout(() => this.shakeError = false, 600);
  }
}
