import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Receta } from '../../models/receta.model';
import { RecetasService } from '../../services/recetas.service';

@Component({
  selector: 'app-lista-recetas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="recetas-container">
      <div class="recetas-header">
        <h2>Recetas Publicadas</h2>
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
          <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z"/>
        </svg>
        <h3>No hay recetas disponibles</h3>
        <p>Sé el primero en compartir una receta deliciosa</p>
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
      background: #fff;
      border: 1px solid #e5e5e5;
      border-radius: 12px;
      padding: 20px;
      transition: box-shadow 0.2s;
    }

    .receta-card:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
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
export class ListaRecetasComponent {
  @Input() recetas: Receta[] = [];
  @Input() currentUserId?: string;
  @Output() verReceta = new EventEmitter<Receta>();
  @Output() editarReceta = new EventEmitter<Receta>();
  @Output() eliminarReceta = new EventEmitter<Receta>();

  filtroCategoria: string = '';
  recetasFiltradas: Receta[] = [];

  constructor(private recetasService: RecetasService) {}

  ngOnInit() {
    this.recetasFiltradas = this.recetas;
  }

  ngOnChanges() {
    this.filtrarRecetas();
  }

  filtrarRecetas() {
    if (this.filtroCategoria) {
      this.recetasFiltradas = this.recetas.filter(r => r.categoria === this.filtroCategoria);
    } else {
      this.recetasFiltradas = this.recetas;
    }
  }

  async confirmarEliminar(receta: Receta) {
    if (confirm(`¿Estás seguro de eliminar "${receta.titulo}"?`)) {
      this.eliminarReceta.emit(receta);
    }
  }
}