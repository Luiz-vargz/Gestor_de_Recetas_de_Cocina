import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-error',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="error-container">
      <div class="error-content">
        <svg viewBox="0 0 24 24" fill="currentColor" class="error-icon">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
        </svg>
        <h1>404</h1>
        <h2>Página no encontrada</h2>
        <p>Lo sentimos, la página que buscas no existe.</p>
        <button class="home-btn" (click)="volverHome()">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
          </svg>
          Volver al inicio
        </button>
      </div>
    </div>
  `,
  styles: [`
    .error-container {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100%;
      padding: 40px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .error-content {
      text-align: center;
      color: white;
      max-width: 500px;
    }

    .error-icon {
      width: 120px;
      height: 120px;
      margin-bottom: 24px;
      opacity: 0.9;
    }

    h1 {
      font-size: 120px;
      margin: 0;
      font-weight: 700;
      line-height: 1;
    }

    h2 {
      font-size: 32px;
      margin: 16px 0;
      font-weight: 500;
    }

    p {
      font-size: 18px;
      margin: 16px 0 32px;
      opacity: 0.9;
    }

    .home-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 14px 28px;
      border: 2px solid white;
      background: white;
      color: #667eea;
      border-radius: 30px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
    }

    .home-btn:hover {
      background: transparent;
      color: white;
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
    }

    .home-btn svg {
      width: 20px;
      height: 20px;
    }
  `]
})
export class ErrorComponent {
  constructor(private router: Router) {}

  volverHome() {
    this.router.navigate(['/home']);
  }
}