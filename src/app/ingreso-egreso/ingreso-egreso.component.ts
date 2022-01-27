import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { AppState } from '../app.reducer';
import { IngresoEgreso } from '../models/ingreso-egreso.model';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';
import * as ui from 'src/app/shared/ui.actions';

@Component({
  selector: 'app-ingreso-egreso',
  templateUrl: './ingreso-egreso.component.html',
  styles: [
  ]
})
export class IngresoEgresoComponent implements OnInit, OnDestroy {

  form!: FormGroup;
  tipo = 'ingreso';
  cargando = false;
  uiSubs!: Subscription;

  constructor(
    private fb: FormBuilder,
    private ingresoServices: IngresoEgresoService,
    private store: Store<AppState>
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      descripcion: ['', Validators.required],
      monto: ['', Validators.required]
    });

    this.uiSubs = this.store.select('ui')
    .subscribe( ui => this.cargando = ui.isLoading );
  }

  ngOnDestroy(): void {
    this.uiSubs.unsubscribe();
  }

  save(): void{

    this.store.dispatch(ui.isLoading());
    /* setTimeout(() => {
      //this.store.dispatch(ui.isLoading());
      this.store.dispatch(ui.stopLoading());
    }, 2500); */

    if (this.form.invalid){ return }
    const { descripcion, monto } = this.form.value;
    const ingresoEgreso = new IngresoEgreso(descripcion,monto,this.tipo);
    this.ingresoServices.crearIngresoEgreso(ingresoEgreso)
    .then( () => {
      this.store.dispatch(ui.stopLoading());
      this.form.reset();
      Swal.fire('Registro creado',descripcion,'success');
    })
    .catch( err => {Swal.fire('Error',err.message,'error'); this.store.dispatch(ui.stopLoading());});
  }

}
