import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Receta } from '../models/receta.model';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private editarRecetaSubject = new Subject<Receta>();
  editarReceta$ = this.editarRecetaSubject.asObservable();

  abrirEditarReceta(receta: Receta) {
    this.editarRecetaSubject.next(receta);
  }
}