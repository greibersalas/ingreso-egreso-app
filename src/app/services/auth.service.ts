import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { map } from 'rxjs/operators';
import { AppState } from '../app.reducer';
import * as authAction from '../auth/auth.actions';
import * as ingresoAction from '../ingreso-egreso/ingreso-egreso.actions';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  userSubs!: Subscription;
  private _user!: Usuario;

  get user() {
    return this._user;
  }

  constructor(
    public auth: AngularFireAuth,
    private firestore: AngularFirestore,
    private store: Store<AppState>
  ) { }

  initAuthListener() {
    this.auth.authState.subscribe( fuser => {
      if (fuser){
        this. userSubs = this.firestore.doc(`${fuser.uid}/usuario`).valueChanges()
        .subscribe( Fbuser => {
          const user = Usuario.fromFirebase(Fbuser);
          this._user = user;
          this.store.dispatch(authAction.setUser({ user }));
        });
      } else {
        this.userSubs?.unsubscribe();
        this.store.dispatch(authAction.unSetUser());
        this.store.dispatch(ingresoAction.unSetItems());
      }
      
    });
  }

  crearUsaurio(nombre: string, email: string, password: string) {
    //
    return this.auth.createUserWithEmailAndPassword( email, password)
    .then( ({ user }) => {
      const newUser = new Usuario(user?.uid, nombre, user?.email);
      return this.firestore.doc(`${user?.uid}/usuario`).set({...newUser});
    });
  }

  loginUsuario(email: string, password: string) {
    return this.auth.signInWithEmailAndPassword( email, password );
  }

  logout() {
    return this.auth.signOut();
  }

  isAuth(){
    return this.auth.authState.pipe(
      map( fUser => fUser != null)
    );
  }
}
