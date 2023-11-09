import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, getDocs, orderBy,  query, collectionData, doc, updateDoc } from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private firestore : Firestore) { }

  guardar(coleccion : string, objeto : any)
  {
    const col = collection(this.firestore, coleccion);
    addDoc(col, objeto);

    return objeto;
  }

  traer(coleccion : string) : Observable<any[]>
  {
    const colRef = collection(this.firestore, coleccion);
    return collectionData(colRef, {idField: 'id'}) as Observable<any[]>;
  }

  async modificar(col: string, obj: any) 
  {
      const docRef = doc(this.firestore, col, obj.id);
  
      try 
      {
        await updateDoc(docRef, obj);
        return 'Registro actualizado correctamente.';
      } 
      catch (error) 
      {
        console.error('Error al actualizar el registro en Firestore:', error);
        throw error;
      }
  } 
}
