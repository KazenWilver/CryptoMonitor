import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { AlertService } from '../../../core/services/alert.service';

@Component({
  selector: 'app-forgot-password',
  standalone: false,
  template: `
    <div class="auth-page">
      <div class="auth-card" [class.shake]="shakeError">
        <div class="auth-header">
          <span class="logo-icon pulse-glow">◈</span>
          <h3>CryptoMonitor</h3>
          <p class="text-muted">{{ 'auth.forgotPassword' | translate }}</p>
        </div>

        <div *ngIf="successMessage" class="alert alert-success" style="margin-bottom: 20px; text-align: center;">
          {{ successMessage }}
          <div *ngIf="devToken" style="margin-top: 10px; font-size: 0.8em; word-break: break-all; background: rgba(0,0,0,0.2); padding: 5px; border-radius: 4px;">
            DEV TOKEN (Copie para testar o reset):<br>
            <strong>{{ devToken }}</strong>
            <br>
            <a routerLink="/auth/reset-password" [queryParams]="{token: devToken}" style="color: #4a90e2; text-decoration: underline;">Ir para Reset Password</a>
          </div>
        </div>

        <form [formGroup]="form" (ngSubmit)="onSubmit()" *ngIf="!successMessage">
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

          <div class="form-error login-error" *ngIf="error">
            <span class="error-icon">✕</span> {{ error }}
          </div>

          <button type="submit" class="btn btn-primary btn-lg w-full" [disabled]="loading">
            <span class="spinner" *ngIf="loading"></span>
            {{ loading ? '' : ('auth.sendInstructions' | translate) }}
          </button>
        </form>

        <div class="auth-footer" style="margin-top: 20px;">
          <a routerLink="/auth/login">{{ 'auth.backToLogin' | translate }}</a>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['../login/login.component.scss']
})
export class ForgotPasswordComponent {
  form: FormGroup;
  loading = false;
  error = '';
  shakeError = false;
  successMessage = '';
  devToken = '';

  constructor(
    private fb: FormBuilder, 
    private auth: AuthService, 
    private router: Router,
    private alertService: AlertService
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
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

    this.auth.forgotPassword(this.form.value.email).subscribe({
      next: (res) => {
        this.loading = false;
        this.successMessage = res.message || 'Se o email existir, receberá instruções de recuperação.';
        if (res.data?.reset_token) {
          this.devToken = res.data.reset_token;
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.error || 'Erro ao processar o pedido';
        this.triggerShake();
      }
    });
  }

  private triggerShake(): void {
    this.shakeError = true;
    setTimeout(() => this.shakeError = false, 600);
  }
}
