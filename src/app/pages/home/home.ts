import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ListaRecetasComponent } from '../../components/lista-recetas/lista-recetas';
import { VerRecetaComponent } from '../../components/ver-receta/ver-receta';
import { RecetasService } from '../../services/recetas.service';
import { AuthService } from '../../services/auth.service';
import { Receta } from '../../models/receta.model';
import { Router } from '@angular/router';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ListaRecetasComponent, VerRecetaComponent],
  template: `
    <div class="page-container">
      <app-lista-recetas
        [recetas]="recetas"
        [currentUserId]="currentUser?.uid"
        [terminoBusqueda]="terminoBusqueda"
        [soloFavoritos]="false"
        [soloPublicaciones]="false"
        (verReceta)="verDetalleReceta($event)"
        (editarReceta)="editarReceta($event)"
        (eliminarReceta)="eliminarReceta($event)">
      </app-lista-recetas>

      <app-ver-receta
        *ngIf="recetaSeleccionada"
        [receta]="recetaSeleccionada"
        (close)="recetaSeleccionada = null">
      </app-ver-receta>
    </div>
  `,
  styles: [`
    .page-container {
      min-height: 100%;
    }
  `]
})
export class HomeComponent implements OnInit {
  recetas: Receta[] = [];
  currentUser: any = null;
  terminoBusqueda: string = '';
  recetaSeleccionada: Receta | null = null;

  constructor(
    private recetasService: RecetasService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: ModalService
  ) {
    this.authService.user$.subscribe(user => {
      this.currentUser = user;
    });
  }

  async ngOnInit() {
    await this.cargarRecetas();
    
    // Escuchar cambios en los parámetros de búsqueda
    this.route.queryParams.subscribe(params => {
      this.terminoBusqueda = params['busqueda'] || '';
    });
  }

  async cargarRecetas() {
    this.recetas = await this.recetasService.obtenerRecetas();
  }

  verDetalleReceta(receta: Receta) {
    if (receta.id) {
      this.router.navigate(['/receta', receta.id]);
    }
  }
  editarReceta(receta: Receta) {
  this.modalService.abrirEditarReceta(receta);
  }

  async eliminarReceta(receta: Receta) {
    if (receta.id) {
      try {
        await this.recetasService.eliminarReceta(receta.id);
        await this.cargarRecetas();
      } catch (error) {
        alert('Error al eliminar la receta');
      }
    }
  }
}