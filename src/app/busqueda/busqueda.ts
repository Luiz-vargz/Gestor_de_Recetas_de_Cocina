import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-busqueda',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="search-container">
      <div class="search-box" [class.focused]="isFocused">
        <input
          type="text"
          placeholder="Buscar"
          [(ngModel)]="searchQuery"
          (focus)="isFocused = true"
          (blur)="isFocused = false"
          (keyup.enter)="onSearch()"
        />
        <button class="search-btn" (click)="onSearch()">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.87 20.17l-5.59-5.59C16.35 13.35 17 11.75 17 10c0-3.87-3.13-7-7-7s-7 3.13-7 7 3.13 7 7 7c1.75 0 3.35-.65 4.58-1.71l5.59 5.59.7-.71zM10 16c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"/>
          </svg>
        </button>
      </div>
      <button class="login-btn" (click)="onLogin()">
        <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
        </svg>
        Iniciar sesión
      </button>
    </div>
  `,
  styles: [`
    .search-container {
      display: flex;
      align-items: center;
      gap: 12px;
      max-width: 640px;
      width: 100%;
    }

    .search-box {
      display: flex;
      flex: 1;
      height: 40px;
      border: 1px solid #ccc;
      border-radius: 40px;
      overflow: hidden;
      transition: border-color 0.2s, box-shadow 0.2s;
    }

    .search-box.focused {
      border-color: #1c62b9;
      box-shadow: 0 0 0 1px #1c62b9 inset;
    }

    .search-box input {
      flex: 1;
      padding: 0 16px;
      border: none;
      outline: none;
      font-size: 16px;
      font-family: 'Roboto', Arial, sans-serif;
      background: #fff;
    }

    .search-box input::placeholder {
      color: #888;
    }

    .search-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 64px;
      border: none;
      border-left: 1px solid #ccc;
      background: #f8f8f8;
      cursor: pointer;
      transition: background 0.2s;
    }

    .search-btn:hover {
      background: #f0f0f0;
    }

    .search-btn svg {
      width: 24px;
      height: 24px;
      color: #606060;
    }

    .mic-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 44px;
      height: 44px;
      border: none;
      border-radius: 50%;
      background: #f8f8f8;
      cursor: pointer;
      transition: background 0.2s;
    }

    .mic-btn:hover {
      background: #e8e8e8;
    }

    .mic-btn svg {
      width: 24px;
      height: 24px;
      color: #606060;
    }

    .login-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      border: 1px solid #065fd4;
      border-radius: 40px;
      background: transparent;
      color: #065fd4;
      font-size: 14px;
      font-weight: 500;
      font-family: 'Roboto', Arial, sans-serif;
      cursor: pointer;
      transition: background 0.2s;
      white-space: nowrap;
    }

    .login-btn:hover {
      background: #def1ff;
    }

    .login-btn svg {
      flex-shrink: 0;
    }
  `]
})
export class BusquedaComponent {
  searchQuery: string = '';
  isFocused: boolean = false;

  @Output() search = new EventEmitter<string>();
  @Output() openLogin = new EventEmitter<void>();

  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.search.emit(this.searchQuery);
      console.log('Buscando:', this.searchQuery);
    }
  }
  onLogin(): void {
    this.openLogin.emit();
  }
}