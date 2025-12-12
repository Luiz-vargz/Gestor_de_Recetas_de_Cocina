import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { 
    path: 'home', 
    loadComponent: () => import('./pages/home/home').then(m => m.HomeComponent)
  },
  { 
    path: 'mis-recetas', 
    loadComponent: () => import('./pages/mis-recetas/mis-recetas').then(m => m.MisRecetasComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'favoritos', 
    loadComponent: () => import('./pages/favoritos/favoritos').then(m => m.FavoritosComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'receta/:id', 
    loadComponent: () => import('./pages/detalle-receta/detalle-receta').then(m => m.DetalleRecetaComponent)
  },
  { 
    path: 'error', 
    loadComponent: () => import('./pages/error/error').then(m => m.ErrorComponent)
  },
  { path: '**', redirectTo: '/error' }
];