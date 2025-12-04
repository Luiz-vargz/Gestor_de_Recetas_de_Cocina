import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Receta } from '../../models/receta.model';

@Component({
  selector: 'app-ver-receta',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-overlay" (click)="close.emit()">
      <div class="modal-container" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <div>
            <span class="categoria">{{ receta.categoria }}</span>
            <h2>{{ receta.titulo }}</h2>
            <p class="autor">Por: {{ receta.userEmail }}</p>
          </div>
          <button class="close-btn" (click)="close.emit()">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>

        <div class="modal-content">
          <div class="tiempo-badge">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
            </svg>
            {{ receta.tiempo_preparacion }} minutos
          </div>

          <section class="section">
            <h3>Ingredientes</h3>
            <ul class="ingredientes-list">
              <li *ngFor="let ingrediente of receta.ingredientes">
                {{ ingrediente }}
              </li>
            </ul>
          </section>

          <section class="section">
            <h3>Preparación</h3>
            <ol class="pasos-list">
              <li *ngFor="let paso of receta.pasos">
                {{ paso }}
              </li>
            </ol>
          </section>
        </div>
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
      padding: 20px;
    }

    .modal-container {
      background: #fff;
      border-radius: 12px;
      width: 100%;
      max-width: 800px;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 24px;
      border-bottom: 1px solid #e5e5e5;
      position: sticky;
      top: 0;
      background: #fff;
      z-index: 1;
    }

    .categoria {
      display: inline-block;
      padding: 4px 12px;
      background: #e8f5e9;
      color: #2e7d32;
      border-radius: 16px;
      font-size: 12px;
      font-weight: 500;
      margin-bottom: 8px;
    }

    .modal-header h2 {
      margin: 0 0 8px;
      font-size: 28px;
      font-weight: 500;
      color: #0f0f0f;
    }

    .autor {
      margin: 0;
      font-size: 14px;
      color: #606060;
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
      flex-shrink: 0;
    }

    .close-btn:hover {
      background: #f0f0f0;
    }

    .close-btn svg {
      width: 24px;
      height: 24px;
      color: #606060;
    }

    .modal-content {
      padding: 24px;
    }

    .tiempo-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 12px 20px;
      background: #f0f7ff;
      border-radius: 8px;
      color: #065fd4;
      font-weight: 500;
      margin-bottom: 24px;
    }

    .tiempo-badge svg {
      width: 20px;
      height: 20px;
    }

    .section {
      margin-bottom: 32px;
    }

    .section h3 {
      margin: 0 0 16px;
      font-size: 20px;
      font-weight: 500;
      color: #0f0f0f;
    }

    .ingredientes-list,
    .pasos-list {
      margin: 0;
      padding-left: 24px;
    }

    .ingredientes-list li,
    .pasos-list li {
      margin-bottom: 12px;
      line-height: 1.6;
      color: #0f0f0f;
    }

    .pasos-list li {
      margin-bottom: 16px;
    }
  `]
})
export class VerRecetaComponent {
  @Input() receta!: Receta;
  @Output() close = new EventEmitter<void>();
}