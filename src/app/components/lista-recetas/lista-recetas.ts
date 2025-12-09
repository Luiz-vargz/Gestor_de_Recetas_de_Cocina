import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Receta, Favorito } from '../../models/receta.model';
import { RecetasService } from '../../services/recetas.service';
import { FavoritosService } from '../../services/favoritos.service';

@Component({
  selector: 'app-lista-recetas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="recetas-container">
      <div class="recetas-header">
        <h2>{{ soloFavoritos ? 'Mis Favoritos' : (soloPublicaciones ? 'Mis Publicaciones' : 'Recetas Publicadas') }}</h2>
        <div class="filtros">
          <select [(ngModel)]="filtroCategoria" (change)="filtrarRecetas()">
            <option value="">Todas las categorías</option>
            <option value="Desayuno">Desayuno</option>
            <option value="Almuerzo">Almuerzo</option>
            <option value="Cena">Cena</option>
            <option value="Postre">Postre</option>
            <option value="Bebida">Bebida</option>
            <option value="Entrada">Entrada</option>
            <option value="Snack">Snack</option>
          </select>
        </div>
      </div>

      <div class="recetas-grid" *ngIf="recetasFiltradas.length > 0">
        <div class="receta-card" *ngFor="let receta of recetasFiltradas">
          <!-- Botón de Favorito -->
          <button 
            class="favorito-btn" 
            [class.favorito-activo]="esFavorita(receta.id)"
            (click)="toggleFavorito(receta)"
            *ngIf="currentUserId"
            title="{{ esFavorita(receta.id) ? 'Quitar de favoritos' : 'Agregar a favoritos' }}">
            <svg viewBox="0 0 24 24" [attr.fill]="esFavorita(receta.id) ? '#ff0000' : 'none'" stroke="currentColor" stroke-width="2">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
            </svg>
          </button>

          <div class="receta-header">
            <div class="receta-categoria">{{ receta.categoria }}</div>
            <div class="receta-tiempo">
              <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
              </svg>
              {{ receta.tiempo_preparacion }} min
            </div>
          </div>
          
          <h3 class="receta-titulo">{{ receta.titulo }}</h3>
          
          <div class="receta-autor">
            Por: {{ receta.userEmail }}
          </div>

          <div class="receta-info">
            <div class="info-item">
              <strong>{{ receta.ingredientes.length }}</strong> ingredientes
            </div>
            <div class="info-item">
              <strong>{{ receta.pasos.length }}</strong> pasos
            </div>
          </div>

          <button class="ver-btn" (click)="verReceta.emit(receta)">
            Ver receta completa
          </button>

          <div class="receta-actions" *ngIf="currentUserId && receta.userId === currentUserId">
            <button class="edit-btn" (click)="editarReceta.emit(receta)">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
              </svg>
              Editar
            </button>
            <button class="delete-btn" (click)="confirmarEliminar(receta)">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
              </svg>
              Eliminar
            </button>
          </div>
        </div>
      </div>

      <div class="empty-state" *ngIf="recetasFiltradas.length === 0">
        <svg viewBox="0 0 24 24" fill="currentColor" width="64" height="64">
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
        </svg>
        <h3>{{ soloFavoritos ? 'No tienes favoritos' : 'No hay recetas disponibles' }}</h3>
        <p>{{ soloFavoritos ? 'Agrega recetas a favoritos para verlas aquí' : 'Sé el primero en compartir una receta deliciosa' }}</p>
      </div>
    </div>
  `,
  styles: [`
    .recetas-container {
      padding: 24px;
    }

    .recetas-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .recetas-header h2 {
      margin: 0;
      font-size: 28px;
      font-weight: 500;
      color: #0f0f0f;
    }

    .filtros select {
      padding: 10px 16px;
      border: 1px solid #ccc;
      border-radius: 8px;
      font-size: 14px;
      cursor: pointer;
    }

    .recetas-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 24px;
    }

    .receta-card {
      position: relative;
      background: #fff;
      border: 1px solid #e5e5e5;
      border-radius: 12px;
      padding: 20px;
      transition: box-shadow 0.2s;
    }

    .receta-card:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .favorito-btn {
      position: absolute;
      top: 12px;
      right: 12px;
      width: 40px;
      height: 40px;
      border: none;
      background: white;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      transition: all 0.2s;
      z-index: 10;
    }

    .favorito-btn:hover {
      transform: scale(1.1);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .favorito-btn svg {
      width: 24px;
      height: 24px;
      color: #606060;
      transition: all 0.2s;
    }

    .favorito-btn.favorito-activo svg {
      color: #ff0000;
      transform: scale(1.1);
    }

    .receta-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }

    .receta-categoria {
      display: inline-block;
      padding: 4px 12px;
      background: #e8f5e9;
      color: #2e7d32;
      border-radius: 16px;
      font-size: 12px;
      font-weight: 500;
    }

    .receta-tiempo {
      display: flex;
      align-items: center;
      gap: 4px;
      color: #606060;
      font-size: 14px;
    }

    .receta-titulo {
      margin: 0 0 8px;
      font-size: 20px;
      font-weight: 500;
      color: #0f0f0f;
    }

    .receta-autor {
      font-size: 13px;
      color: #606060;
      margin-bottom: 16px;
    }

    .receta-info {
      display: flex;
      gap: 16px;
      margin-bottom: 16px;
      padding: 12px;
      background: #f9f9f9;
      border-radius: 8px;
    }

    .info-item {
      font-size: 14px;
      color: #606060;
    }

    .info-item strong {
      color: #0f0f0f;
    }

    .ver-btn {
      width: 100%;
      padding: 10px;
      border: none;
      background: #065fd4;
      color: #fff;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.2s;
      margin-bottom: 12px;
    }

    .ver-btn:hover {
      background: #0550b8;
    }

    .receta-actions {
      display: flex;
      gap: 8px;
    }

    .edit-btn,
    .delete-btn {
      flex: 1;
      padding: 8px;
      border: none;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
      transition: background 0.2s;
    }

    .edit-btn {
      background: #e3f2fd;
      color: #1976d2;
    }

    .edit-btn:hover {
      background: #bbdefb;
    }

    .delete-btn {
      background: #ffebee;
      color: #d32f2f;
    }

    .delete-btn:hover {
      background: #ffcdd2;
    }

    .edit-btn svg,
    .delete-btn svg {
      width: 16px;
      height: 16px;
    }

    .empty-state {
      text-align: center;
      padding: 64px 24px;
      color: #606060;
    }

    .empty-state svg {
      margin-bottom: 16px;
      opacity: 0.5;
    }

    .empty-state h3 {
      margin: 0 0 8px;
      font-size: 20px;
      color: #0f0f0f;
    }

    .empty-state p {
      margin: 0;
      font-size: 14px;
    }
  `]
})
export class ListaRecetasComponent implements OnInit, OnChanges {
  @Input() recetas: Receta[] = [];
  @Input() currentUserId?: string;
  @Input() soloFavoritos: boolean = false;
  @Input() soloPublicaciones: boolean = false;
  @Output() verReceta = new EventEmitter<Receta>();
  @Output() editarReceta = new EventEmitter<Receta>();
  @Output() eliminarReceta = new EventEmitter<Receta>();

  filtroCategoria: string = '';
  recetasFiltradas: Receta[] = [];
  favoritos: Favorito[] = [];

  constructor(
    private recetasService: RecetasService,
    private favoritosService: FavoritosService
  ) {}

  async ngOnInit() {
    await this.cargarFavoritos();
    this.filtrarRecetas();
  }

  async ngOnChanges() {
    await this.cargarFavoritos();
    this.filtrarRecetas();
  }

  async cargarFavoritos() {
    if (this.currentUserId) {
      this.favoritos = await this.favoritosService.obtenerFavoritosPorUsuario(this.currentUserId);
    }
  }

  filtrarRecetas() {
    let recetasBase = this.recetas;

    // Si es la vista de favoritos, filtrar solo favoritos
    if (this.soloFavoritos && this.currentUserId) {
      const idsRecetasFavoritas = this.favoritos.map(f => f.recetaId);
      recetasBase = this.recetas.filter(r => idsRecetasFavoritas.includes(r.id || ''));
    }

    //vistas de publicaciones
    if (this.soloPublicaciones && this.currentUserId) {
      recetasBase = this.recetas.filter(r => r.userId === this.currentUserId);
    }

    // Aplicar filtro de categoría
    if (this.filtroCategoria) {
      this.recetasFiltradas = recetasBase.filter(r => r.categoria === this.filtroCategoria);
    } else {
      this.recetasFiltradas = recetasBase;
    }
  }

  esFavorita(recetaId: string | undefined): boolean {
    if (!recetaId) return false;
    return this.favoritos.some(f => f.recetaId === recetaId);
  }

  async toggleFavorito(receta: Receta) {
    if (!this.currentUserId || !receta.id) {
      alert('Debes iniciar sesión para agregar favoritos');
      return;
    }

    const favoritoExistente = this.favoritos.find(f => f.recetaId === receta.id);

    if (favoritoExistente && favoritoExistente.id) {
      // Quitar de favoritos
      await this.favoritosService.quitarFavorito(favoritoExistente.id);
    } else {
      // Agregar a favoritos
      await this.favoritosService.agregarFavorito(this.currentUserId, receta.id);
    }

    // Recargar favoritos
    await this.cargarFavoritos();
    this.filtrarRecetas();
  }

  async confirmarEliminar(receta: Receta) {
    if (confirm(`¿Estás seguro de eliminar "${receta.titulo}"?`)) {
      this.eliminarReceta.emit(receta);
    }
  }
}