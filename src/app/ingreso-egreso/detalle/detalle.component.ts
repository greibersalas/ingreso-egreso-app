import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

import { Store } from '@ngrx/store';
import { AppStateWithIngreso } from '../ingreso-egreso.reducer';

import { IngresoEgreso } from 'src/app/models/ingreso-egreso.model';
import { IngresoEgresoService } from 'src/app/services/ingreso-egreso.service';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styles: [
  ]
})
export class DetalleComponent implements OnInit, OnDestroy {

  list: IngresoEgreso[] = [];
  ingresoSubs!: Subscription;

  constructor(
    private store: Store<AppStateWithIngreso>,
    private ingresoService: IngresoEgresoService
  ) { }

  ngOnInit(): void {
    this.ingresoSubs = this.store.select('ingresoEgreso')
    .subscribe( ({items}) => this.list = items);
  }

  ngOnDestroy(): void {
    this.ingresoSubs.unsubscribe();
  }

  borrar(uid: string | undefined) {
    console.log({uid});
    this.ingresoService.borrarItem(uid)
    .then( () => Swal.fire('Borrado','Item borrado','success'))
    .catch( err => Swal.fire('Error',err.message,'error'))
  }

}
