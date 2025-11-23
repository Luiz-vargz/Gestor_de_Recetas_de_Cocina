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
    </div>
  `,
  styles: [`
    .search-container {
      display: flex;
      align-items: center;
      gap: 12px;
      width: 700px;
    }

    .search-box {
      display: flex;
      flex: 1;
      height: 40px;
      border: 1px solid #110808ff;
      overflow: hidden;
      transition: border-color 0.2s, box-shadow 0.2s;
    }

    .search-box.focused {
      border-color: #25a858ff;
      box-shadow: 0 0 0 1px #15a528ff inset;
    }

    .search-box input {
      flex: 1;
      padding: 0 16px;
      border: none;
      outline: none;
      font-size: 16px;
      font-family: 'Roboto', Arial, sans-serif;
      background: #ffffffff;
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
  `]
})
export class BusquedaComponent {
  searchQuery: string = '';
  isFocused: boolean = false;

  @Output() search = new EventEmitter<string>();

  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.search.emit(this.searchQuery);
      console.log('Buscando:', this.searchQuery);
    }
  }
}