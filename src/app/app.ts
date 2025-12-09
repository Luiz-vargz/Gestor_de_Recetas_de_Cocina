import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuComponent } from './menu/menu';
import { BusquedaComponent } from './busqueda/busqueda';
import { LoginComponent } from './login/login';
import { CrearRecetaComponent } from './components/crear-receta/crear-receta';
import { ListaRecetasComponent } from './components/lista-recetas/lista-recetas';
import { VerRecetaComponent } from './components/ver-receta/ver-receta';
import { AuthService } from './services/auth.service';
import { RecetasService } from './services/recetas.service';
import { Receta } from './models/receta.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    MenuComponent, 
    BusquedaComponent, 
    LoginComponent,
    CrearRecetaComponent,
    ListaRecetasComponent,
    VerRecetaComponent
  ],
  template: `
    <div class="app-container">
      <app-menu (menuSeleccionado)="cambiarVista($event)"></app-menu>
      <div class="main-content">
        <header class="header">
          <app-busqueda 
            [isLoggedIn]="!!currentUser"
            (search)="onSearch($event)"
            (openLogin)="showLogin = true"
            (openCrearReceta)="abrirCrearReceta()">
          </app-busqueda>
          <div class="user-info" *ngIf="currentUser">
            <span>{{ currentUser.email }}</span>
            <button (click)="onLogout()" class="logout-btn">Cerrar sesión</button>
          </div>
        </header>
        
        <main class="content">
          <app-lista-recetas
                [recetas]="recetas"
                [currentUserId]="currentUser?.uid"
                [soloFavoritos]="vistaActual === 'favoritos'"
                [soloPublicaciones]="vistaActual === 'publicaciones'"
                (verReceta)="abrirVerReceta($event)"
                (editarReceta)="abrirEditarReceta($event)"
                (eliminarReceta)="eliminarReceta($event)">
          </app-lista-recetas>
        </main>
      </div>
    </div>
    
    <!-- Modal Login -->
    <app-login 
      *ngIf="showLogin"
      (close)="showLogin = false"
      (loginSuccess)="onLoginSuccess($event)">
    </app-login>

    <!-- Modal Crear/Editar Receta -->
    <app-crear-receta
      *ngIf="showCrearReceta"
      [userId]="currentUser?.uid || ''"
      [userEmail]="currentUser?.email || ''"
      [recetaEditar]="recetaEditar"
      (close)="cerrarCrearReceta()"
      (recetaCreada)="cargarRecetas()">
    </app-crear-receta>

    <!-- Modal Ver Receta -->
    <app-ver-receta
      *ngIf="recetaSeleccionada"
      [receta]="recetaSeleccionada"
      (close)="recetaSeleccionada = null">
    </app-ver-receta>
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
export class AppComponent implements OnInit {
  showLogin = false;
  showCrearReceta = false;
  currentUser: any = null;
  recetas: Receta[] = [];
  recetaSeleccionada: Receta | null = null;
  recetaEditar: Receta | undefined = undefined;
  vistaActual: string = 'todas';

  constructor(
    private authService: AuthService,
    private recetasService: RecetasService
  )
   {
    this.authService.user$.subscribe(user => {
      this.currentUser = user;
      this.cargarRecetas();
    });
  }

  ngOnInit() {
    this.cargarRecetas();
  }

  async cargarRecetas() {
    this.recetas = await this.recetasService.obtenerRecetas();
  }

  onSearch(query: string) {
    console.log('Búsqueda recibida:', query);
    // Aquí puedes implementar la búsqueda de recetas
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

  abrirEditarReceta(receta: Receta) {
    this.recetaEditar = receta;
    this.showCrearReceta = true;
  }

  cerrarCrearReceta() {
    this.showCrearReceta = false;
    this.recetaEditar = undefined;
  }

  abrirVerReceta(receta: Receta) {
    this.recetaSeleccionada = receta;
  }

  async eliminarReceta(receta: Receta) {
    if (receta.id) {
      try {
        await this.recetasService.eliminarReceta(receta.id);
        await this.cargarRecetas();
      } catch (error) {
        alert('Error al eliminar la receta');
      }
    }
  }

  onLoginSuccess(data: any) {
    console.log('Login exitoso:', data.user.email);
    this.showLogin = false;
    this.cargarRecetas();
  }

  async onLogout() {
    try {
      await this.authService.logout();
      this.recetas = [];
      console.log('Sesión cerrada');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }
  cambiarVista(menuId: string) {
  if (menuId === 'favoritos') {
    this.vistaActual = 'favoritos';
  } else if (menuId == 'publicaciones') {
    this.vistaActual = 'publicaciones';
  } else if (menuId === 'recetas') {
    this.vistaActual = 'todas';
  }
  }
}