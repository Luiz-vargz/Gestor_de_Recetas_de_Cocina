import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from './menu/menu';
import { BusquedaComponent } from './busqueda/busqueda';
import { LoginComponent } from './login/login';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MenuComponent, BusquedaComponent, LoginComponent, CommonModule],
  template: `
    <div class="app-container">
      <app-menu></app-menu>
      <div class="main-content">
        <header class="header">
          <app-busqueda 
            (search)="onSearch($event)"
            (openLogin)="showLogin = true">
          </app-busqueda>
          <div class="user-info" *ngIf="currentUser">
            <span>Hola, {{ currentUser.email }}</span>
            <button (click)="onLogout()" class="logout-btn">Cerrar sesión</button>
          </div>
        </header>
        <main class="content">
          <h1>Contenido Principal</h1>
        </main>
      </div>
    </div>
    
    <app-login 
      *ngIf="showLogin"
      (close)="showLogin = false"
      (loginSuccess)="onLoginSuccess($event)">
    </app-login>
  `,
  styles: [`
    .app-container { display: flex; min-height: 100vh; }
    .main-content { flex: 1; display: flex; flex-direction: column; }
    .header { 
      padding: 16px 24px; 
      background: #fff; 
      border-bottom: 1px solid #e5e5e5; 
      display: flex; 
      justify-content: space-between;
      align-items: center;
      gap: 20px;
    }
    .content { flex: 1; padding: 24px; background: #f9f9f9; }
    .user-info {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 14px;
    }
    .logout-btn {
      padding: 8px 16px;
      border: 1px solid #ccc;
      border-radius: 20px;
      background: white;
      cursor: pointer;
      font-size: 14px;
    }
    .logout-btn:hover {
      background: #f5f5f5;
    }
  `]
})
export class AppComponent {
  showLogin = false;
  currentUser: any = null;

  constructor(private authService: AuthService) {
    this.authService.user$.subscribe(user => {
      this.currentUser = user;
    });
  }

  onSearch(query: string) {
    console.log('Búsqueda recibida:', query);
  }

  onLoginSuccess(data: any) {
    console.log('Login exitoso:', data.user.email);
    this.showLogin = false;
  }

  async onLogout() {
    try {
      await this.authService.logout();
      console.log('Sesión cerrada');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }
}