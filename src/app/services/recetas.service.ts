import { Injectable } from '@angular/core';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs,
  query,
  where,
  orderBy,
  Timestamp
} from 'firebase/firestore';
import { Receta } from '../models/receta.model';

@Injectable({
  providedIn: 'root'
})
export class RecetasService {
  private db = getFirestore();
  private recetasCollection = collection(this.db, 'recetas');

  // Crear una nueva receta
  async crearReceta(receta: Receta): Promise<string> {
    try {
      const recetaConFecha = {
        ...receta,
        createdAt: Timestamp.now()
      };
      const docRef = await addDoc(this.recetasCollection, recetaConFecha);
      return docRef.id;
    } catch (error) {
      console.error('Error al crear receta:', error);
      throw error;
    }
  }

  // Obtener todas las recetas
  async obtenerRecetas(): Promise<Receta[]> {
    try {
      const q = query(this.recetasCollection, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Receta));
    } catch (error) {
      console.error('Error al obtener recetas:', error);
      return [];
    }
  }

  // Obtener recetas de un usuario específico
  async obtenerRecetasPorUsuario(userId: string): Promise<Receta[]> {
    try {
      const q = query(
        this.recetasCollection, 
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Receta));
    } catch (error) {
      console.error('Error al obtener recetas del usuario:', error);
      return [];
    }
  }

  // Actualizar una receta
  async actualizarReceta(id: string, receta: Partial<Receta>): Promise<void> {
    try {
      const recetaDoc = doc(this.db, 'recetas', id);
      await updateDoc(recetaDoc, receta);
    } catch (error) {
      console.error('Error al actualizar receta:', error);
      throw error;
    }
  }

  // Eliminar una receta
  async eliminarReceta(id: string): Promise<void> {
    try {
      const recetaDoc = doc(this.db, 'recetas', id);
      await deleteDoc(recetaDoc);
    } catch (error) {
      console.error('Error al eliminar receta:', error);
      throw error;
    }
  }
}