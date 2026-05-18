import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: false,
  template: `
    <div class="auth-page">
      <div class="auth-card" [class.shake]="shakeError">
        <div class="auth-header">
          <span class="logo-icon pulse-glow">◈</span>
          <h3>CryptoMonitor</h3>
          <p class="text-muted">{{ 'auth.resetPassword' | translate }}</p>
        </div>

        <div *ngIf="successMessage" class="alert alert-success" style="margin-bottom: 20px; text-align: center;">
          <p style="font-weight: bold; margin-bottom: 10px;">{{ successMessage }}</p>
          <p class="text-sm text-muted" style="margin-bottom: 20px;">Você será redirecionado para a tela de login em {{ countdown }} segundos...</p>
          <button (click)="goToLogin()" class="btn btn-primary w-full">Ir para a Tela de Login Agora</button>
        </div>

        <form [formGroup]="form" (ngSubmit)="onSubmit()" *ngIf="!successMessage">
          <div class="form-group">
            <label>Token</label>
            <input type="text" formControlName="token" placeholder="Insira o token de recuperação"
                   [class.input-error]="form.get('token')?.invalid && form.get('token')?.touched" />
            <div class="form-error" *ngIf="form.get('token')?.hasError('required') && form.get('token')?.touched">
              Token é obrigatório
            </div>
          </div>

          <div class="form-group">
            <label>{{ 'auth.newPassword' | translate }}</label>
            <input type="password" formControlName="password" placeholder="••••••"
                   [class.input-error]="form.get('password')?.invalid && form.get('password')?.touched" />
            <div class="form-error" *ngIf="form.get('password')?.hasError('required') && form.get('password')?.touched">
              Nova password é obrigatória
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
            {{ loading ? '' : ('auth.resetPasswordBtn' | translate) }}
          </button>
        </form>

        <div class="auth-footer" style="margin-top: 20px;" *ngIf="!successMessage">
          <a routerLink="/auth/login">{{ 'auth.backToLogin' | translate }}</a>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['../login/login.component.scss']
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  form: FormGroup;
  loading = false;
  error = '';
  shakeError = false;
  successMessage = '';
  countdown = 10;
  private countdownInterval: any;

  constructor(
    private fb: FormBuilder, 
    private auth: AuthService, 
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      token: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    // Tenta pegar o token da URL se existir
    this.route.queryParams.subscribe(params => {
      if (params['token']) {
        this.form.patchValue({ token: params['token'] });
      }
    });
  }

  ngOnDestroy(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.triggerShake();
      return;
    }
    this.loading = true;
    this.error = '';

    this.auth.resetPassword(this.form.value.token, this.form.value.password).subscribe({
      next: (res) => {
        this.loading = false;
        this.successMessage = res.message || 'Senha alterada com sucesso!';
        this.startCountdown();
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.error || 'Erro ao redefinir a senha (Token inválido ou expirado)';
        this.triggerShake();
      }
    });
  }

  startCountdown(): void {
    this.countdown = 10;
    this.countdownInterval = setInterval(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        this.goToLogin();
      }
    }, 1000);
  }

  goToLogin(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
    this.router.navigate(['/auth/login']);
  }

  private triggerShake(): void {
    this.shakeError = true;
    setTimeout(() => this.shakeError = false, 600);
  }
}
