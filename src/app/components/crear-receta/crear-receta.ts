import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RecetasService } from '../../services/recetas.service';
import { Receta } from '../../models/receta.model';

@Component({
  selector: 'app-crear-receta',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-overlay" (click)="onClose()">
      <div class="modal-container" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>{{ recetaEditar ? 'Editar Receta' : 'Nueva Receta' }}</h2>
          <button class="close-btn" (click)="onClose()">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>

        <div class="error-message" *ngIf="errorMessage">
          {{ errorMessage }}
        </div>

        <form class="receta-form" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="titulo">Título *</label>
            <input
              id="titulo"
              type="text"
              [(ngModel)]="titulo"
              name="titulo"
              placeholder="Ej: Paella Valenciana"
              required
            />
          </div>

          <div class="form-group">
            <label for="categoria">Categoría *</label>
            <select id="categoria" [(ngModel)]="categoria" name="categoria" required>
              <option value="">Selecciona una categoría</option>
              <option value="Desayuno">Desayuno</option>
              <option value="Almuerzo">Almuerzo</option>
              <option value="Cena">Cena</option>
              <option value="Postre">Postre</option>
              <option value="Bebida">Bebida</option>
              <option value="Entrada">Entrada</option>
              <option value="Snack">Snack</option>
            </select>
          </div>

          <div class="form-group">
            <label for="tiempo">Tiempo de preparación (minutos) *</label>
            <input
              id="tiempo"
              type="number"
              [(ngModel)]="tiempo_preparacion"
              name="tiempo"
              placeholder="30"
              min="1"
              required
            />
          </div>

          <div class="form-group">
            <label>Ingredientes *</label>
            <div class="list-items">
              <div class="list-item" *ngFor="let ing of ingredientes; let i = index; trackBy: trackByIndex">
                <input
                  type="text"
                  [(ngModel)]="ingredientes[i]"
                  [name]="'ingrediente-' + i"
                  placeholder="Ej: 500g de arroz"
                />
                <button type="button" class="remove-btn" (click)="eliminarIngrediente(i)">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                  </svg>
                </button>
              </div>
            </div>
            <button type="button" class="add-btn" (click)="agregarIngrediente()">
              + Agregar ingrediente
            </button>
          </div>

          <div class="form-group">
            <label>Pasos de preparación *</label>
            <div class="list-items">
              <div class="list-item" *ngFor="let paso of pasos; let i = index; trackBy: trackByIndex">
                <span class="step-number">{{ i + 1 }}</span>
                <textarea
                  [(ngModel)]="pasos[i]"
                  [name]="'paso-' + i"
                  placeholder="Describe el paso..."
                  rows="2"
                ></textarea>
                <button type="button" class="remove-btn" (click)="eliminarPaso(i)">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                  </svg>
                </button>
              </div>
            </div>
            <button type="button" class="add-btn" (click)="agregarPaso()">
              + Agregar paso
            </button>
          </div>

          <div class="form-actions">
            <button type="button" class="cancel-btn" (click)="onClose()">
              Cancelar
            </button>
            <button type="submit" class="submit-btn" [disabled]="loading">
              {{ loading ? 'Guardando...' : (recetaEditar ? 'Actualizar' : 'Publicar') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
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
      overflow-y: auto;
      padding: 20px;
    }

    .modal-container {
      background: #fff;
      border-radius: 12px;
      width: 100%;
      max-width: 700px;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 24px;
      border-bottom: 1px solid #e5e5e5;
      position: sticky;
      top: 0;
      background: #fff;
      z-index: 1;
    }

    .modal-header h2 {
      margin: 0;
      font-size: 24px;
      font-weight: 500;
      color: #0f0f0f;
    }

    .close-btn {
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

    .error-message {
      margin: 16px 24px;
      padding: 12px;
      background: #fee;
      border: 1px solid #fcc;
      border-radius: 8px;
      color: #c33;
      font-size: 14px;
    }

    .receta-form {
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 24px;
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

    .form-group input,
    .form-group select,
    .form-group textarea {
      padding: 12px;
      border: 1px solid #ccc;
      border-radius: 8px;
      font-size: 14px;
      font-family: 'Roboto', Arial, sans-serif;
      transition: border-color 0.2s;
    }

    .form-group input:focus,
    .form-group select:focus,
    .form-group textarea:focus {
      outline: none;
      border-color: #065fd4;
    }

    .list-items {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .list-item {
      display: flex;
      gap: 8px;
      align-items: flex-start;
    }

    .list-item input,
    .list-item textarea {
      flex: 1;
    }

    .step-number {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      background: #065fd4;
      color: white;
      border-radius: 50%;
      font-weight: 500;
      font-size: 14px;
      flex-shrink: 0;
    }

    .remove-btn {
      width: 32px;
      height: 32px;
      border: none;
      background: #fee;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s;
      flex-shrink: 0;
    }

    .remove-btn:hover {
      background: #fcc;
    }

    .remove-btn svg {
      width: 18px;
      height: 18px;
      color: #c33;
    }

    .add-btn {
      padding: 10px 16px;
      border: 1px dashed #065fd4;
      background: transparent;
      color: #065fd4;
      border-radius: 8px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      transition: background 0.2s;
    }

    .add-btn:hover {
      background: #f0f7ff;
    }

    .form-actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      padding-top: 16px;
      border-top: 1px solid #e5e5e5;
    }

    .cancel-btn,
    .submit-btn {
      padding: 12px 24px;
      border: none;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.2s;
    }

    .cancel-btn {
      background: #f0f0f0;
      color: #0f0f0f;
    }

    .cancel-btn:hover {
      background: #e0e0e0;
    }

    .submit-btn {
      background: #065fd4;
      color: #fff;
    }

    .submit-btn:hover:not(:disabled) {
      background: #0550b8;
    }

    .submit-btn:disabled {
      background: #ccc;
      cursor: not-allowed;
    }
  `]
})
export class CrearRecetaComponent {
  @Input() userId!: string;
  @Input() userEmail!: string;
  @Input() recetaEditar?: Receta;
  @Output() close = new EventEmitter<void>();
  @Output() recetaCreada = new EventEmitter<void>();

  titulo: string = '';
  categoria: string = '';
  tiempo_preparacion: number = 0;
  ingredientes: string[] = [''];
  pasos: string[] = [''];
  errorMessage: string = '';
  loading: boolean = false;

  constructor(private recetasService: RecetasService) {}

  ngOnInit() {
    if (this.recetaEditar) {
      this.titulo = this.recetaEditar.titulo;
      this.categoria = this.recetaEditar.categoria;
      this.tiempo_preparacion = this.recetaEditar.tiempo_preparacion;
      this.ingredientes = [...this.recetaEditar.ingredientes];
      this.pasos = [...this.recetaEditar.pasos];
    }
  }

  agregarIngrediente() {
    this.ingredientes.push('');
  }

  eliminarIngrediente(index: number) {
    if (this.ingredientes.length > 1) {
      this.ingredientes.splice(index, 1);
    }
  }

  agregarPaso() {
    this.pasos.push('');
  }

  eliminarPaso(index: number) {
    if (this.pasos.length > 1) {
      this.pasos.splice(index, 1);
    }
  }

  async onSubmit() {
    // Validaciones
    if (!this.titulo || !this.categoria || !this.tiempo_preparacion) {
      this.errorMessage = 'Por favor completa todos los campos requeridos';
      return;
    }

    const ingredientesFiltrados = this.ingredientes.filter(i => i.trim() !== '');
    const pasosFiltrados = this.pasos.filter(p => p.trim() !== '');

    if (ingredientesFiltrados.length === 0) {
      this.errorMessage = 'Agrega al menos un ingrediente';
      return;
    }

    if (pasosFiltrados.length === 0) {
      this.errorMessage = 'Agrega al menos un paso';
      return;
    }

    this.errorMessage = '';
    this.loading = true;

    try {
      const receta: Receta = {
        titulo: this.titulo,
        ingredientes: ingredientesFiltrados,
        pasos: pasosFiltrados,
        categoria: this.categoria,
        tiempo_preparacion: this.tiempo_preparacion,
        userId: this.userId,
        userEmail: this.userEmail
      };

      if (this.recetaEditar && this.recetaEditar.id) {
        await this.recetasService.actualizarReceta(this.recetaEditar.id, receta);
      } else {
        await this.recetasService.crearReceta(receta);
      }

      this.recetaCreada.emit();
      this.onClose();
    } catch (error) {
      this.errorMessage = 'Error al guardar la receta. Intenta de nuevo.';
    } finally {
      this.loading = false;
    }
  }

  onClose() {
    this.close.emit();
  }
  trackByIndex(index: number): number {
  return index;
}
}