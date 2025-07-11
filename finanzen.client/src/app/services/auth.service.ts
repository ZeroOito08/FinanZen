import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());
  public isLoggedIn$ = this.loggedIn.asObservable();

  constructor() { }

  // CORREÇÃO: Procura por 'jwt_token'
  private hasToken(): boolean {
    return !!localStorage.getItem('jwt_token');
  }

  login() {
    this.loggedIn.next(true);
  }

  logout() {
    localStorage.removeItem('jwt_token');
    this.loggedIn.next(false);
  }
}