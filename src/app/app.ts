import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MenuComponent } from './menu/menu';
import { BusquedaComponent } from './busqueda/busqueda';
import { LoginComponent } from './login/login';
import { CrearRecetaComponent } from './components/crear-receta/crear-receta';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { ModalService } from './services/modal.service';
import { Receta } from './models/receta.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MenuComponent,
    BusquedaComponent,
    LoginComponent,
    CrearRecetaComponent
  ],
  template: `
    <div class="app-container">
      <app-menu
        [isLoggedIn]="!!currentUser"
        (menuSeleccionado)="navegarA($event)">
      </app-menu>
      
      <div class="main-content">
        <header class="header">
          <app-busqueda 
            [isLoggedIn]="!!currentUser"
            (search)="buscarRecetas($event)"
            (openLogin)="showLogin = true"
            (openCrearReceta)="abrirCrearReceta()">
          </app-busqueda>
          
          <div class="user-info" *ngIf="currentUser">
            <span>{{ currentUser.email }}</span>
            <button (click)="onLogout()" class="logout-btn">Cerrar sesión</button>
          </div>
        </header>
        
        <main class="content">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
    
    <!-- Modal Login -->
    <app-login 
      *ngIf="showLogin"
      (close)="showLogin = false"
      (loginSuccess)="onLoginSuccess($event)">
    </app-login>

    <!-- Modal Crear Receta -->
    <app-crear-receta
      *ngIf="showCrearReceta"
      [userId]="currentUser?.uid || ''"
      [userEmail]="currentUser?.email || ''"
      [recetaEditar]="recetaEditar"
      (close)="cerrarCrearReceta()"
      (recetaCreada)="recetaCreada()">
    </app-crear-receta>
  `,
  styles: [`
    .app-container { 
      display: flex; 
      min-height: 100vh; 
    }
    
    .main-content { 
      flex: 1; 
      display: flex; 
      flex-direction: column; 
    }
    
    .header { 
      padding: 16px 24px; 
      background: #fff; 
      border-bottom: 1px solid #e5e5e5; 
      display: flex; 
      justify-content: space-between;
      align-items: center;
      gap: 20px;
    }
    
    .content { 
      flex: 1; 
      background: #f9f9f9; 
      overflow-y: auto;
    }
    
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
      transition: background 0.2s;
    }
    
    .logout-btn:hover {
      background: #f5f5f5;
    }
  `]
})
export class AppComponent {
  showLogin = false;
  showCrearReceta = false;
  currentUser: any = null;
  recetaEditar: any = undefined;

  constructor(
  private authService: AuthService,
  private router: Router,
  private modalService: ModalService
  ) {
  this.authService.user$.subscribe(user => {
    this.currentUser = user;
  });

  // Escuchar eventos de editar receta
  this.modalService.editarReceta$.subscribe(receta => {
    this.recetaEditar = receta;
    this.showCrearReceta = true;
  });
  }

  navegarA(menuId: string) {
    const rutas: any = {
      'recetas': '/home',
      'publicaciones': '/mis-recetas',
      'favoritos': '/favoritos'
    };
    
    if (rutas[menuId]) {
      this.router.navigate([rutas[menuId]]);
    }
  }

  buscarRecetas(query: string) {
    // Navegar a home con parámetro de búsqueda
    this.router.navigate(['/home'], { queryParams: { busqueda: query } });
  }

  abrirCrearReceta() {
    if (!this.currentUser) {
      alert('Debes iniciar sesión para crear una receta');
      this.showLogin = true;
      return;
    }
    this.recetaEditar = undefined;
    this.showCrearReceta = true;
  }

  cerrarCrearReceta() {
    this.showCrearReceta = false;
    this.recetaEditar = undefined;
  }

  recetaCreada() {
    this.cerrarCrearReceta();
    // Recargar la página actual
    window.location.reload();
  }

  onLoginSuccess(data: any) {
    this.showLogin = false;
  }

  async onLogout() {
    try {
      await this.authService.logout();
      this.router.navigate(['/home']);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }
  editarReceta(receta: Receta) {
  this.recetaEditar = receta;
  this.showCrearReceta = true;
  }
  
}