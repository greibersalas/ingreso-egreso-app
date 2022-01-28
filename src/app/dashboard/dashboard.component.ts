import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AppState } from '../app.reducer';
import * as ingresoActions from '../ingreso-egreso/ingreso-egreso.actions';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [
  ]
})
export class DashboardComponent implements OnInit, OnDestroy {

  userSubs!: Subscription;
  ingresoSubs!: Subscription;
  constructor(
    private store: Store<AppState>,
    private ingresoService: IngresoEgresoService
  ) { }

  ngOnInit(): void {
    this.userSubs = this.store.select('user')
    .pipe(
      filter( auth => auth.user != null)
    )
    .subscribe( ({user}) => {
      this.ingresoSubs = this.ingresoService.initIngresoEgresoListener(user?.uid)
      .subscribe( items => {
        this.store.dispatch(ingresoActions.setItems({items: items}));
      });
    });
  }

  ngOnDestroy(): void {
    this.ingresoSubs?.unsubscribe();
    this.userSubs?.unsubscribe();

  }

}
