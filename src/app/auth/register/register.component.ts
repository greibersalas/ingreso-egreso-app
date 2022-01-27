import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { AppState } from 'src/app/app.reducer';
import * as ui from 'src/app/shared/ui.actions';


import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
  ]
})
export class RegisterComponent implements OnInit, OnDestroy {

  form!: FormGroup;
  cargando = false;
  uiSubs!: Subscription;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private store: Store<AppState>
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    this.uiSubs = this.store.select('ui')
    .subscribe( ui => this.cargando = ui.isLoading );
  }

  ngOnDestroy(): void {
    this.uiSubs.unsubscribe();
  }

  crearUsuario(): void{

    if (this.form.invalid) { return; }
    this.store.dispatch(ui.isLoading());
    /* Swal.fire({
      title: 'Registrando!',
      didOpen: () => {
        Swal.showLoading()
      }
    }); */

    const { nombre, correo, password } = this.form.value;

    this.authService.crearUsaurio(nombre,correo,password)
    .then( credenciales => {
      /* console.log({credenciales});
      Swal.close(); */
      this.store.dispatch(ui.stopLoading());
      this.router.navigate(['/']);
    })
    .catch( err => {
      this.store.dispatch(ui.stopLoading());
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: err.message,
      })
    });
    
  }

}
