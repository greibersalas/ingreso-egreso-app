import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import { IngresoEgreso } from 'src/app/models/ingreso-egreso.model';
import { IngresoEgresoService } from 'src/app/services/ingreso-egreso.service';
import Swal from 'sweetalert2';

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
    private store: Store<AppState>,
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
