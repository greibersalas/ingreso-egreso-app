import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map } from 'rxjs/operators';
import { IngresoEgreso } from '../models/ingreso-egreso.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class IngresoEgresoService {

  constructor(
    private firestore: AngularFirestore,
    private authService: AuthService
  ) { }

  crearIngresoEgreso( data: IngresoEgreso) {
    delete data.uid;
    return this.firestore.doc(`${this.authService.user.uid}/ingreso-egreso`)
    .collection('items')
    .add( {...data} );
  }

  initIngresoEgresoListener(uid: string | undefined) {
    return this.firestore.collection(`${uid}/ingreso-egreso/items`)
    .snapshotChanges()
    .pipe(
      map( snapshot => {
        return snapshot.map( doc => {
          return {
            uid: doc.payload.doc.id,
            ...doc.payload.doc.data() as any
          }
        });
      })
    );
  }

  borrarItem( uid: string | undefined) {
    return this.firestore.doc(`${this.authService.user.uid}/ingreso-egreso/items/${uid}`)
    .delete();
  }
}
