import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { UiService } from './services/ui.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'finanzen.client';
  // Propriedade local para controlar o *ngIf no HTML
  showNavbar = false;

  constructor(private router: Router, private uiService: UiService) {
    // Ouve o estado do UiService
    this.uiService.showNavbar.subscribe(value => {
      this.showNavbar = value;
    });

    // Ouve os eventos de navegação do roteador
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Se a URL for de login ou cadastro, avisa para esconder o menu
        if (event.url === '/login' || event.url === '/register') {
          this.uiService.showNavbar.next(false);
        } else {
          // Para todas as outras URLs, avisa para mostrar o menu
          this.uiService.showNavbar.next(true);
        }
      }
    });
  }
}