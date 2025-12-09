import { Injectable } from '@angular/core';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  deleteDoc, 
  doc, 
  getDocs,
  query,
  where,
  Timestamp
} from 'firebase/firestore';
import { Favorito } from '../models/receta.model';

@Injectable({
  providedIn: 'root'
})
export class FavoritosService {
  private db = getFirestore();
  private favoritosCollection = collection(this.db, 'favoritos');

  // Agregar a favoritos
  async agregarFavorito(userId: string, recetaId: string): Promise<void> {
    try {
      await addDoc(this.favoritosCollection, {
        userId,
        recetaId,
        createdAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error al agregar favorito:', error);
      throw error;
    }
  }

  // Quitar de favoritos
  async quitarFavorito(favoritoId: string): Promise<void> {
    try {
      const favoritoDoc = doc(this.db, 'favoritos', favoritoId);
      await deleteDoc(favoritoDoc);
    } catch (error) {
      console.error('Error al quitar favorito:', error);
      throw error;
    }
  }

  // Obtener favoritos de un usuario
  async obtenerFavoritosPorUsuario(userId: string): Promise<Favorito[]> {
    try {
      const q = query(this.favoritosCollection, where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Favorito));
    } catch (error) {
      console.error('Error al obtener favoritos:', error);
      return [];
    }
  }

  // Verificar si una receta es favorita
  async esFavorito(userId: string, recetaId: string): Promise<string | null> {
    try {
      const q = query(
        this.favoritosCollection, 
        where('userId', '==', userId),
        where('recetaId', '==', recetaId)
      );
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        return querySnapshot.docs[0].id;
      }
      return null;
    } catch (error) {
      console.error('Error al verificar favorito:', error);
      return null;
    }
  }
}