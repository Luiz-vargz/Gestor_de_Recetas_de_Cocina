import { TiempoPipe } from '../../pipes/tiempo.pipe';
import { DatePipe, UpperCasePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { RecetasService } from '../../services/recetas.service';
import { FavoritosService } from '../../services/favoritos.service';
import { AuthService } from '../../services/auth.service';
import { Receta } from '../../models/receta.model';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-detalle-receta',
  standalone: true,
  imports: [CommonModule, TiempoPipe, DatePipe, UpperCasePipe],
  template: `
    <div class="detalle-container" *ngIf="receta">
      <button class="back-btn" (click)="volver()">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
        </svg>
        Volver
      </button>

      <div class="detalle-header">
        <div class="header-content">
          <span class="categoria">{{ receta.categoria }}</span>
          <h1>{{ receta.titulo | uppercase }}</h1>
          <p class="autor">Por: {{ receta.userEmail }}</p>
          <p class="fecha" *ngIf="receta.createdAt">
            Publicado el {{ receta.createdAt.toDate() | date:'dd MMMM yyyy':'':'es' }}
          </p>
        </div>

        <button 
          class="favorito-btn-grande" 
          [class.favorito-activo]="esFavorita"
          (click)="toggleFavorito()"
          *ngIf="currentUser">
          <svg viewBox="0 0 24 24" [attr.fill]="esFavorita ? '#ff0000' : 'none'" stroke="currentColor" stroke-width="2">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
          </svg>
          {{ esFavorita ? 'Quitar de favoritos' : 'Agregar a favoritos' }}
        </button>
      </div>

      <div class="tiempo-info">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
        </svg>
        <span>{{ receta.tiempo_preparacion | tiempo }}</span>
      </div>

      <div class="detalle-content">
        <section class="section">
          <h2>Ingredientes</h2>
          <ul class="ingredientes-list">
            <li *ngFor="let ingrediente of receta.ingredientes">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
              </svg>
              {{ ingrediente }}
            </li>
          </ul>
        </section>

        <section class="section">
          <h2>Preparación</h2>
          <ol class="pasos-list">
            <li *ngFor="let paso of receta.pasos; let i = index">
              <span class="paso-numero">{{ i + 1 }}</span>
              <p>{{ paso }}</p>
            </li>
          </ol>
        </section>
      </div>

      <div class="acciones" *ngIf="currentUser && receta.userId === currentUser.uid">
        <button class="btn-editar" (click)="editarReceta()">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
          </svg>
          Editar receta
        </button>
        <button class="btn-eliminar" (click)="eliminarReceta()">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
          </svg>
          Eliminar receta
        </button>
      </div>
    </div>

    <div class="loading" *ngIf="!receta">
      <p>Cargando receta...</p>
    </div>
  `,
  styles: [`
    .detalle-container {
      max-width: 900px;
      margin: 0 auto;
      padding: 40px 24px;
    }

    .back-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      border: 1px solid #ccc;
      background: white;
      border-radius: 8px;
      cursor: pointer;
      font-size: 14px;
      margin-bottom: 24px;
      transition: background 0.2s;
    }

    .back-btn:hover {
      background: #f5f5f5;
    }

    .back-btn svg {
      width: 20px;
      height: 20px;
    }

    .detalle-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 24px;
      margin-bottom: 24px;
      padding-bottom: 24px;
      border-bottom: 2px solid #e5e5e5;
    }

    .header-content {
      flex: 1;
    }

    .categoria {
      display: inline-block;
      padding: 6px 16px;
      background: #e8f5e9;
      color: #2e7d32;
      border-radius: 20px;
      font-size: 14px;
      font-weight: 500;
      margin-bottom: 16px;
    }

    h1 {
      margin: 0 0 12px;
      font-size: 36px;
      font-weight: 600;
      color: #0f0f0f;
    }

    .autor {
      margin: 0;
      font-size: 16px;
      color: #606060;
    }

    .favorito-btn-grande {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 24px;
      border: 2px solid #606060;
      background: white;
      border-radius: 30px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.2s;
      white-space: nowrap;
    }

    .favorito-btn-grande:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .favorito-btn-grande.favorito-activo {
      border-color: #ff0000;
      color: #ff0000;
    }

    .favorito-btn-grande svg {
      width: 24px;
      height: 24px;
    }

    .tiempo-info {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px 24px;
      background: #f0f7ff;
      border-radius: 12px;
      color: #065fd4;
      font-size: 18px;
      font-weight: 500;
      margin-bottom: 40px;
    }

    .tiempo-info svg {
      width: 28px;
      height: 28px;
    }

    .detalle-content {
      display: flex;
      flex-direction: column;
      gap: 48px;
    }

    .section h2 {
      margin: 0 0 24px;
      font-size: 28px;
      font-weight: 600;
      color: #0f0f0f;
    }

    .ingredientes-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: grid;
      gap: 12px;
    }

    .ingredientes-list li {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      background: #f9f9f9;
      border-radius: 8px;
      font-size: 16px;
      line-height: 1.6;
    }

    .ingredientes-list svg {
      width: 20px;
      height: 20px;
      color: #2e7d32;
      flex-shrink: 0;
    }

    .pasos-list {
      list-style: none;
      padding: 0;
      margin: 0;
      counter-reset: step-counter;
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .pasos-list li {
      display: flex;
      gap: 20px;
      counter-increment: step-counter;
    }

    .paso-numero {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      background: #065fd4;
      color: white;
      border-radius: 50%;
      font-weight: 600;
      font-size: 18px;
      flex-shrink: 0;
    }

    .pasos-list p {
      margin: 0;
      padding-top: 8px;
      font-size: 16px;
      line-height: 1.8;
      color: #0f0f0f;
    }

    .acciones {
      display: flex;
      gap: 16px;
      margin-top: 48px;
      padding-top: 32px;
      border-top: 2px solid #e5e5e5;
    }

    .btn-editar,
    .btn-eliminar {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 14px 24px;
      border: none;
      border-radius: 10px;
      font-size: 16px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-editar {
      background: #e3f2fd;
      color: #1976d2;
    }

    .btn-editar:hover {
      background: #bbdefb;
      transform: translateY(-2px);
    }

    .btn-eliminar {
      background: #ffebee;
      color: #d32f2f;
    }

    .btn-eliminar:hover {
      background: #ffcdd2;
      transform: translateY(-2px);
    }

    .btn-editar svg,
    .btn-eliminar svg {
      width: 20px;
      height: 20px;
    }

    .loading {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 400px;
      font-size: 18px;
      color: #606060;
    }

    @media (max-width: 768px) {
      .detalle-header {
        flex-direction: column;
      }

      h1 {
        font-size: 28px;
      }

      .acciones {
        flex-direction: column;
      }
    }
  `]
})
export class DetalleRecetaComponent implements OnInit {
  receta: Receta | null = null;
  currentUser: any = null;
  esFavorita: boolean = false;
  favoritoId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private recetasService: RecetasService,
    private favoritosService: FavoritosService,
    private authService: AuthService,
    private modalService: ModalService
  ) {
    this.authService.user$.subscribe(user => {
      this.currentUser = user;
    });
  }

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      await this.cargarReceta(id);
      if (this.currentUser) {
        await this.verificarFavorito(id);
      }
    }
  }

  async cargarReceta(id: string) {
    const recetas = await this.recetasService.obtenerRecetas();
    this.receta = recetas.find(r => r.id === id) || null;
  }

  async verificarFavorito(recetaId: string) {
    if (this.currentUser) {
      this.favoritoId = await this.favoritosService.esFavorito(this.currentUser.uid, recetaId);
      this.esFavorita = this.favoritoId !== null;
    }
  }

  async toggleFavorito() {
    if (!this.currentUser || !this.receta?.id) {
      alert('Debes iniciar sesión');
      return;
    }

    if (this.esFavorita && this.favoritoId) {
      await this.favoritosService.quitarFavorito(this.favoritoId);
      this.esFavorita = false;
      this.favoritoId = null;
    } else {
      await this.favoritosService.agregarFavorito(this.currentUser.uid, this.receta.id);
      await this.verificarFavorito(this.receta.id);
    }
  }

  volver() {
    this.router.navigate(['/home']);
  }
  editarReceta() {
  if (this.receta) {
    this.modalService.abrirEditarReceta(this.receta);
  }
  }

  async eliminarReceta() {
    if (!this.receta?.id) return;

    if (confirm(`¿Estás seguro de eliminar "${this.receta.titulo}"?`)) {
      try {
        await this.recetasService.eliminarReceta(this.receta.id);
        alert('Receta eliminada correctamente');
        this.router.navigate(['/home']);
      } catch (error) {
        alert('Error al eliminar la receta');
      }
    }
  }
}