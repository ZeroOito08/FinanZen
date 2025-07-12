import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());
  public isLoggedIn$ = this.loggedIn.asObservable();

  constructor() {
    // Garante que ao recarregar a página, o estado permanece sincronizado com o token
    window.addEventListener('storage', () => {
      this.loggedIn.next(this.hasToken());
    });
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('jwt_token');
  }

  login(token: string) {
    localStorage.setItem('jwt_token', token);
    this.loggedIn.next(true);
  }

  logout() {
    localStorage.removeItem('jwt_token');
    this.loggedIn.next(false);
  }

  getToken(): string | null {
    return localStorage.getItem('jwt_token');
  }
}
