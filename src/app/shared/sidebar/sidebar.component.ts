import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AppState } from 'src/app/app.reducer';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [
  ]
})
export class SidebarComponent implements OnInit, OnDestroy {

  nombre: string | undefined = '';
  userSubs?: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
    private store: Store<AppState>
  ) { }

  ngOnInit(): void {
    this.userSubs = this.store.select('user')
    .pipe(
      filter( ({user}) => user != null)
    )
    .subscribe( ({user}) => this.nombre = user?.nombre);
  }

  ngOnDestroy(): void {
    this.userSubs?.unsubscribe();
  }

  logout(): void{
    this.authService.logout()
    .then(resp => {
      this.router.navigate(['/login']);
    });
  }

}
