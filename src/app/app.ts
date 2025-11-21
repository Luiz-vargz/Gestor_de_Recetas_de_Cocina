import { Component } from '@angular/core';
import { MenuComponent } from './menu/menu';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MenuComponent],
  template: `
    <div class="app-container">
      <app-menu></app-menu>
      <main class="content">
        <h1>Contenido Principal</h1>
      </main>
    </div>
  `,
  styles: [`
    .app-container {
      display: flex;
      min-height: 100vh;
    }
    .content {
      flex: 1;
      padding: 24px;
      background: #f9f9f9;
    }
  `]
})
export class AppComponent {}