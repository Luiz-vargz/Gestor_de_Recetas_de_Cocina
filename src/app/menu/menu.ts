import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  active: boolean;
}

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="sidebar" [class.collapsed]="isCollapsed">
      <!-- Toggle Button -->
      <button class="toggle-btn" (click)="toggleSidebar()">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
        </svg>
      </button>

      <!-- Menu Items -->
      <nav class="menu">
        <button 
          *ngFor="let item of menuItems" 
          class="menu-item"
          [class.active]="item.active"
          (click)="selectItem(item)">
          <span class="icon" [innerHTML]="item.icon"></span>
          <span class="label" *ngIf="!isCollapsed">{{ item.label }}</span>
        </button>
      </nav>
    </div>
  `,
  styles: [`
    .sidebar {
      width: 240px;
      height: 100vh;
      background: #fff;
      border-right: 1px solid #e5e5e5;
      padding: 8px 0;
      transition: width 0.2s ease;
      display: flex;
      flex-direction: column;
    }

    .sidebar.collapsed {
      width: 72px;
    }

    .toggle-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      margin: 8px 16px 16px;
      border: none;
      background: transparent;
      border-radius: 50%;
      cursor: pointer;
      color: #606060;
      transition: background 0.2s;
    }

    .toggle-btn:hover {
      background: #f2f2f2;
    }

    .menu {
      display: flex;
      flex-direction: column;
      gap: 4px;
      padding: 0 12px;
    }

    .menu-item {
      display: flex;
      align-items: center;
      gap: 24px;
      padding: 10px 12px;
      border: none;
      background: transparent;
      border-radius: 10px;
      cursor: pointer;
      font-size: 14px;
      font-family: 'Roboto', Arial, sans-serif;
      color: #0f0f0f;
      transition: background 0.2s;
      white-space: nowrap;
    }

    .sidebar.collapsed .menu-item {
      flex-direction: column;
      gap: 6px;
      padding: 16px 4px;
      font-size: 10px;
    }

    .menu-item:hover {
      background: #f2f2f2;
    }

    .menu-item.active {
      background: #f2f2f2;
      font-weight: 500;
    }

    .icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
    }

    .icon svg {
      width: 24px;
      height: 24px;
    }

    .label {
      flex: 1;
      text-align: left;
    }

    .sidebar.collapsed .label {
      text-align: center;
    }
  `]
})
export class MenuComponent {
  isCollapsed = false;

  menuItems: MenuItem[] = [
    {
      id: 'recetas',
      label: 'Recetas',
      icon: `<svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M8.1 13.34l2.83-2.83L3.91 3.5c-1.56 1.56-1.56 4.09 0 5.66l4.19 4.18zm6.78-1.81c1.53.71 3.68.21 5.27-1.38 1.91-1.91 2.28-4.65.81-6.12-1.46-1.46-4.2-1.1-6.12.81-1.59 1.59-2.09 3.74-1.38 5.27L3.7 19.87l1.41 1.41L12 14.41l6.88 6.88 1.41-1.41L13.41 13l1.47-1.47z"/>
      </svg>`,
      active: true
    },
    {
      id: 'categorias',
      label: 'Categorías',
      icon: `<svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2l-5.5 9h11L12 2zm0 3.84L13.93 9h-3.87L12 5.84zM17.5 13c-2.49 0-4.5 2.01-4.5 4.5s2.01 4.5 4.5 4.5 4.5-2.01 4.5-4.5-2.01-4.5-4.5-4.5zm0 7c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5zM3 21.5h8v-8H3v8zm2-6h4v4H5v-4z"/>
      </svg>`,
      active: false
    },
    {
      id: 'otros',
      label: 'Otros',
      icon: `<svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
      </svg>`,
      active: false
    }
  ];

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  selectItem(selectedItem: MenuItem): void {
    this.menuItems.forEach(item => item.active = false);
    selectedItem.active = true;
    console.log('Seleccionado:', selectedItem.id);
  }
}