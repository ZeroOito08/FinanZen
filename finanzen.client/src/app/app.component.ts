import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './services/auth.service';
import { LoadingService } from './services/loading.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  showNavbar$: Observable<boolean>;
  isLoading$: Observable<boolean>;

  constructor(
    private authService: AuthService,
    private loadingService: LoadingService
  ) {
    // A visibilidade do menu agora está diretamente ligada ao estado de login
    this.showNavbar$ = this.authService.isLoggedIn$;
    this.isLoading$ = this.loadingService.isLoading;
  }
}