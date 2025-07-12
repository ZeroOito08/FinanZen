import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './services/auth.service';
import { LoadingService } from './services/loading.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { map } from 'rxjs/operators';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  showNavbar$: Observable<boolean>;
  isLoading$: Observable<boolean>;
  rotaAtual: string = '';

  constructor(
    private authService: AuthService,
    private loadingService: LoadingService,
    private router: Router
  ) {
    this.showNavbar$ = this.authService.isLoggedIn$;
    this.isLoading$ = this.loadingService.isLoading;

    // Atualiza a rota atual sempre que ela mudar
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.rotaAtual = event.urlAfterRedirects;
    });
  }

  // Retorna true se a navbar deve ser mostrada
  deveMostrarNavbar(): Observable<boolean> {
    return this.showNavbar$.pipe(
      map(show => show && !this.rotaAtual.includes('/login'))
    );
  }
}
