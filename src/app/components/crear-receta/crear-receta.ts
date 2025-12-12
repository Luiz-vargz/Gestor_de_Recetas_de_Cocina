import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { RecetasService } from '../../services/recetas.service';
import { Receta } from '../../models/receta.model';

@Component({
  selector: 'app-crear-receta',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
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

        <form class="receta-form" [formGroup]="recetaForm" (ngSubmit)="onSubmit()">
          <!-- Título -->
          <div class="form-group">
            <label for="titulo">Título *</label>
            <input
              id="titulo"
              type="text"
              formControlName="titulo"
              placeholder="Ej: Paella Valenciana"
              [class.invalid]="titulo?.invalid && titulo?.touched"
            />
            <div class="error-text" *ngIf="titulo?.invalid && titulo?.touched">
              <span *ngIf="titulo?.errors?.['required']">El título es obligatorio</span>
              <span *ngIf="titulo?.errors?.['minlength']">Mínimo 3 caracteres</span>
              <span *ngIf="titulo?.errors?.['maxlength']">Máximo 100 caracteres</span>
            </div>
          </div>

          <!-- Categoría -->
          <div class="form-group">
            <label for="categoria">Categoría *</label>
            <select 
              id="categoria" 
              formControlName="categoria"
              [class.invalid]="categoria?.invalid && categoria?.touched">
              <option value="">Selecciona una categoría</option>
              <option value="Desayuno">Desayuno</option>
              <option value="Almuerzo">Almuerzo</option>
              <option value="Cena">Cena</option>
              <option value="Postre">Postre</option>
              <option value="Bebida">Bebida</option>
              <option value="Entrada">Entrada</option>
              <option value="Snack">Snack</option>
            </select>
            <div class="error-text" *ngIf="categoria?.invalid && categoria?.touched">
              <span *ngIf="categoria?.errors?.['required']">Selecciona una categoría</span>
            </div>
          </div>

          <!-- Tiempo de preparación -->
          <div class="form-group">
            <label for="tiempo">Tiempo de preparación (minutos) *</label>
            <input
              id="tiempo"
              type="number"
              formControlName="tiempo_preparacion"
              placeholder="30"
              [class.invalid]="tiempo_preparacion?.invalid && tiempo_preparacion?.touched"
            />
            <div class="error-text" *ngIf="tiempo_preparacion?.invalid && tiempo_preparacion?.touched">
              <span *ngIf="tiempo_preparacion?.errors?.['required']">El tiempo es obligatorio</span>
              <span *ngIf="tiempo_preparacion?.errors?.['min']">Mínimo 1 minuto</span>
              <span *ngIf="tiempo_preparacion?.errors?.['max']">Máximo 1440 minutos (24 horas)</span>
            </div>
          </div>

          <!-- Descripción -->
          <div class="form-group">
            <label for="descripcion">Descripción breve</label>
            <textarea
              id="descripcion"
              formControlName="descripcion"
              placeholder="Describe tu receta en pocas palabras..."
              rows="3"
              [class.invalid]="descripcion?.invalid && descripcion?.touched"
            ></textarea>
            <div class="error-text" *ngIf="descripcion?.invalid && descripcion?.touched">
              <span *ngIf="descripcion?.errors?.['maxlength']">Máximo 500 caracteres</span>
            </div>
          </div>

          <!-- Ingredientes -->
          <div class="form-group">
            <label>Ingredientes *</label>
            <div class="list-items" formArrayName="ingredientes">
              <div class="list-item" *ngFor="let ingrediente of ingredientes.controls; let i = index">
                <input
                  type="text"
                  [formControlName]="i"
                  placeholder="Ej: 500g de arroz"
                  [class.invalid]="ingredientes.at(i).invalid && ingredientes.at(i).touched"
                />
                <button type="button" class="remove-btn" (click)="eliminarIngrediente(i)" *ngIf="ingredientes.length > 1">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                  </svg>
                </button>
              </div>
            </div>
            <div class="error-text" *ngIf="ingredientes.invalid && ingredientes.touched">
              <span>Agrega al menos un ingrediente válido</span>
            </div>
            <button type="button" class="add-btn" (click)="agregarIngrediente()">
              + Agregar ingrediente
            </button>
          </div>

          <!-- Pasos -->
          <div class="form-group">
            <label>Pasos de preparación *</label>
            <div class="list-items" formArrayName="pasos">
              <div class="list-item" *ngFor="let paso of pasos.controls; let i = index">
                <span class="step-number">{{ i + 1 }}</span>
                <textarea
                  [formControlName]="i"
                  placeholder="Describe el paso..."
                  rows="2"
                  [class.invalid]="pasos.at(i).invalid && pasos.at(i).touched"
                ></textarea>
                <button type="button" class="remove-btn" (click)="eliminarPaso(i)" *ngIf="pasos.length > 1">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                  </svg>
                </button>
              </div>
            </div>
            <div class="error-text" *ngIf="pasos.invalid && pasos.touched">
              <span>Agrega al menos un paso válido</span>
            </div>
            <button type="button" class="add-btn" (click)="agregarPaso()">
              + Agregar paso
            </button>
          </div>

          <div class="form-actions">
            <button type="button" class="cancel-btn" (click)="onClose()">
              Cancelar
            </button>
            <button type="submit" class="submit-btn" [disabled]="loading || recetaForm.invalid">
              {{ loading ? 'Guardando...' : (recetaEditar ? 'Actualizar' : 'Publicar') }}
            </button>
          </div>

          <div class="form-status" *ngIf="recetaForm.invalid && recetaForm.touched">
            <small>Por favor, completa todos los campos requeridos correctamente</small>
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

    .form-group input.invalid,
    .form-group select.invalid,
    .form-group textarea.invalid {
      border-color: #d32f2f;
    }

    .error-text {
      color: #d32f2f;
      font-size: 12px;
      margin-top: 4px;
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

    .form-status {
      text-align: center;
      color: #d32f2f;
      font-size: 13px;
      padding: 12px;
      background: #fee;
      border-radius: 8px;
    }
  `]
})
export class CrearRecetaComponent implements OnInit {
  @Input() userId!: string;
  @Input() userEmail!: string;
  @Input() recetaEditar?: Receta;
  @Output() close = new EventEmitter<void>();
  @Output() recetaCreada = new EventEmitter<void>();

  recetaForm!: FormGroup;
  errorMessage: string = '';
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private recetasService: RecetasService
  ) {}

  ngOnInit() {
    this.inicializarFormulario();
    if (this.recetaEditar) {
      this.cargarDatosReceta();
    }
  }

  inicializarFormulario() {
    this.recetaForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      categoria: ['', Validators.required],
      tiempo_preparacion: ['', [Validators.required, Validators.min(1), Validators.max(1440)]],
      descripcion: ['', Validators.maxLength(500)],
      ingredientes: this.fb.array([this.fb.control('', Validators.required)]),
      pasos: this.fb.array([this.fb.control('', Validators.required)])
    });
  }

  cargarDatosReceta() {
    if (this.recetaEditar) {
      this.recetaForm.patchValue({
        titulo: this.recetaEditar.titulo,
        categoria: this.recetaEditar.categoria,
        tiempo_preparacion: this.recetaEditar.tiempo_preparacion,
        descripcion: ''
      });

      // Limpiar arrays
      this.ingredientes.clear();
      this.pasos.clear();

      // Cargar ingredientes
      this.recetaEditar.ingredientes.forEach(ing => {
        this.ingredientes.push(this.fb.control(ing, Validators.required));
      });

      // Cargar pasos
      this.recetaEditar.pasos.forEach(paso => {
        this.pasos.push(this.fb.control(paso, Validators.required));
      });
    }
  }

  get titulo() {
    return this.recetaForm.get('titulo');
  }

  get categoria() {
    return this.recetaForm.get('categoria');
  }

  get tiempo_preparacion() {
    return this.recetaForm.get('tiempo_preparacion');
  }

  get descripcion() {
    return this.recetaForm.get('descripcion');
  }

  get ingredientes() {
    return this.recetaForm.get('ingredientes') as FormArray;
  }

  get pasos() {
    return this.recetaForm.get('pasos') as FormArray;
  }

  agregarIngrediente() {
    this.ingredientes.push(this.fb.control('', Validators.required));
  }

  eliminarIngrediente(index: number) {
    if (this.ingredientes.length > 1) {
      this.ingredientes.removeAt(index);
    }
  }

  agregarPaso() {
    this.pasos.push(this.fb.control('', Validators.required));
  }

  eliminarPaso(index: number) {
    if (this.pasos.length > 1) {
      this.pasos.removeAt(index);
    }
  }

  async onSubmit() {
    if (this.recetaForm.invalid) {
      Object.keys(this.recetaForm.controls).forEach(key => {
        this.recetaForm.get(key)?.markAsTouched();
      });
      this.errorMessage = 'Por favor, completa todos los campos correctamente';
      return;
    }

    this.errorMessage = '';
    this.loading = true;

    try {
      const formValue = this.recetaForm.value;
      
      // Filtrar ingredientes y pasos vacíos
      const ingredientesFiltrados = formValue.ingredientes.filter((i: string) => i.trim() !== '');
      const pasosFiltrados = formValue.pasos.filter((p: string) => p.trim() !== '');

      const receta: Receta = {
        titulo: formValue.titulo,
        ingredientes: ingredientesFiltrados,
        pasos: pasosFiltrados,
        categoria: formValue.categoria,
        tiempo_preparacion: formValue.tiempo_preparacion,
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
}