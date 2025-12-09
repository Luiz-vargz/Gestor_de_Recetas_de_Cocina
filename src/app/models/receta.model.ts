export interface Receta {
  id?: string;
  titulo: string;
  ingredientes: string[];
  pasos: string[];
  categoria: string;
  tiempo_preparacion: number; // en minutos
  userId: string;
  userEmail?: string;
  createdAt?: any;
}
export interface Favorito {
  id?: string;
  userId: string;
  recetaId: string;
  createdAt?: any;
}