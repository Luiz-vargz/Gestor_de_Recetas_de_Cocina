import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-overlay" (click)="onClose()">
      <div class="login-container" (click)="$event.stopPropagation()">
        <button class="close-btn" (click)="onClose()">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>

        <div class="login-header">
          <svg viewBox="0 0 24 24" fill="#065fd4" width="40" height="40">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
          </svg>
          <h2>{{ isRegisterMode ? 'Registrarse' : 'Iniciar sesión' }}</h2>
          <p>{{ isRegisterMode ? 'Crea una cuenta nueva' : 'Accede a tu cuenta' }}</p>
        </div>

        <div class="error-message" *ngIf="errorMessage">
          {{ errorMessage }}
        </div>

        <div class="success-message" *ngIf="successMessage">
          {{ successMessage }}
        </div>

        <form class="login-form" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="email">Correo electrónico</label>
            <input
              id="email"
              type="email"
              [(ngModel)]="email"
              name="email"
              placeholder="correo@ejemplo.com"
              required
              [disabled]="loading"
            />
          </div>

          <div class="form-group">
            <label for="password">Contraseña</label>
            <input
              id="password"
              type="password"
              [(ngModel)]="password"
              name="password"
              placeholder="Mínimo 6 caracteres"
              required
              [disabled]="loading"
            />
          </div>

          <div class="form-options" *ngIf="!isRegisterMode">
            <label class="checkbox">
              <input type="checkbox" [(ngModel)]="rememberMe" name="rememberMe">
              <span>Recordarme</span>
            </label>
            <a href="#" class="forgot-password">¿Olvidaste tu contraseña?</a>
          </div>

          <button type="submit" class="login-submit-btn" [disabled]="loading">
            {{ loading ? 'Procesando...' : (isRegisterMode ? 'Registrarse' : 'Iniciar sesión') }}
          </button>

          <div class="divider">
            <span>o</span>
          </div>

          <button type="button" class="google-btn" (click)="onGoogleLogin()" [disabled]="loading">
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continuar con Google
          </button>

          <div class="register-link">
            {{ isRegisterMode ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?' }}
            <a href="#" (click)="toggleMode($event)">
              {{ isRegisterMode ? 'Inicia sesión' : 'Regístrate' }}
            </a>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .login-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      animation: fadeIn 0.2s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .login-container {
      position: relative;
      background: #fff;
      border-radius: 12px;
      padding: 40px;
      width: 90%;
      max-width: 440px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
      animation: slideUp 0.3s ease;
    }

    @keyframes slideUp {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }

    .close-btn {
      position: absolute;
      top: 16px;
      right: 16px;
      width: 32px;
      height: 32px;
      border: none;
      background: transparent;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s;
    }

    .close-btn:hover {
      background: #f0f0f0;
    }

    .close-btn svg {
      width: 24px;
      height: 24px;
      color: #606060;
    }

    .login-header {
      text-align: center;
      margin-bottom: 24px;
    }

    .login-header svg {
      margin-bottom: 16px;
    }

    .login-header h2 {
      margin: 0 0 8px;
      font-size: 28px;
      font-weight: 500;
      color: #0f0f0f;
    }

    .login-header p {
      margin: 0;
      font-size: 14px;
      color: #606060;
    }

    .error-message {
      padding: 12px;
      background: #fee;
      border: 1px solid #fcc;
      border-radius: 8px;
      color: #c33;
      font-size: 14px;
      margin-bottom: 16px;
      text-align: center;
    }

    .success-message {
      padding: 12px;
      background: #efe;
      border: 1px solid #cfc;
      border-radius: 8px;
      color: #3c3;
      font-size: 14px;
      margin-bottom: 16px;
      text-align: center;
    }

    .login-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .form-group label {
      font-size: 14px;
      font-weight: 500;
      color: #0f0f0f;
    }

    .form-group input {
      padding: 12px 16px;
      border: 1px solid #ccc;
      border-radius: 8px;
      font-size: 14px;
      font-family: 'Roboto', Arial, sans-serif;
      transition: border-color 0.2s;
    }

    .form-group input:focus {
      outline: none;
      border-color: #065fd4;
    }

    .form-group input:disabled {
      background: #f5f5f5;
      cursor: not-allowed;
    }

    .form-options {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 14px;
    }

    .checkbox {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
    }

    .checkbox input {
      cursor: pointer;
    }

    .forgot-password {
      color: #065fd4;
      text-decoration: none;
    }

    .forgot-password:hover {
      text-decoration: underline;
    }

    .login-submit-btn {
      padding: 12px;
      border: none;
      border-radius: 8px;
      background: #065fd4;
      color: #fff;
      font-size: 16px;
      font-weight: 500;
      font-family: 'Roboto', Arial, sans-serif;
      cursor: pointer;
      transition: background 0.2s;
    }

    .login-submit-btn:hover:not(:disabled) {
      background: #0550b8;
    }

    .login-submit-btn:disabled {
      background: #ccc;
      cursor: not-allowed;
    }

    .divider {
      position: relative;
      text-align: center;
      margin: 8px 0;
    }

    .divider::before {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      top: 50%;
      height: 1px;
      background: #e0e0e0;
    }

    .divider span {
      position: relative;
      background: #fff;
      padding: 0 16px;
      color: #606060;
      font-size: 14px;
    }

    .google-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      padding: 12px;
      border: 1px solid #dadce0;
      border-radius: 8px;
      background: #fff;
      color: #3c4043;
      font-size: 14px;
      font-weight: 500;
      font-family: 'Roboto', Arial, sans-serif;
      cursor: pointer;
      transition: background 0.2s;
    }

    .google-btn:hover:not(:disabled) {
      background: #f7f8f8;
    }

    .google-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .register-link {
      text-align: center;
      font-size: 14px;
      color: #606060;
    }

    .register-link a {
      color: #065fd4;
      text-decoration: none;
      font-weight: 500;
    }

    .register-link a:hover {
      text-decoration: underline;
    }
  `]
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  rememberMe: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  loading: boolean = false;
  isRegisterMode: boolean = false;

  @Output() close = new EventEmitter<void>();
  @Output() loginSuccess = new EventEmitter<any>();

  constructor(private authService: AuthService) {}

  async onSubmit(): Promise<void> {
    if (!this.email || !this.password) {
      this.errorMessage = 'Por favor completa todos los campos';
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';
    this.loading = true;

    try {
      if (this.isRegisterMode) {
        const user = await this.authService.register(this.email, this.password);
        this.successMessage = '¡Registro exitoso!';
        setTimeout(() => {
          this.loginSuccess.emit({ user });
          this.onClose();
        }, 1500);
      } else {
        const user = await this.authService.login(this.email, this.password);
        this.successMessage = '¡Bienvenido!';
        setTimeout(() => {
          this.loginSuccess.emit({ user });
          this.onClose();
        }, 1000);
      }
    } catch (error: any) {
      this.errorMessage = error;
    } finally {
      this.loading = false;
    }
  }

  async onGoogleLogin(): Promise<void> {
    this.errorMessage = '';
    this.loading = true;

    try {
      const user = await this.authService.loginWithGoogle();
      this.successMessage = '¡Bienvenido!';
      setTimeout(() => {
        this.loginSuccess.emit({ user });
        this.onClose();
      }, 1000);
    } catch (error: any) {
      this.errorMessage = error;
    } finally {
      this.loading = false;
    }
  }

  toggleMode(event: Event): void {
    event.preventDefault();
    this.isRegisterMode = !this.isRegisterMode;
    this.errorMessage = '';
    this.successMessage = '';
  }

  onClose(): void {
    this.close.emit();
  }
}