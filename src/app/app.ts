import { Component } from '@angular/core';
import { MenuComponent } from './menu/menu';
import { BusquedaComponent } from './busqueda/busqueda';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MenuComponent, BusquedaComponent],
  template: `
    <!--busqueda-->
        <div class="app-container">
      <app-menu></app-menu>
      <div class="main-content">
        <header class="header">
          <app-busqueda (search)="onSearch($event)"></app-busqueda>
        </header>
        <main class="content">
          <!--menu-->
          <h1>Contenido de las resetas</h1>
        </main>
      </div>
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
    .app-container { display: flex; min-height: 100vh; }
    .main-content { flex: 1; display: flex; flex-direction: column; }
    .header { padding: 16px 24px; background: #9edb8fff; border-bottom: 1px solid #e5e5e5; display: flex; justify-content: center; }
    .content { flex: 1; padding: 24px; background: #f9f9f9; }
  `]
})
export class AppComponent {
  onSearch(query: string) {
    console.log('Búsqueda recibida:', query);
  }
}