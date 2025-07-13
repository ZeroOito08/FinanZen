import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());
  public isLoggedIn$ = this.loggedIn.asObservable();

  constructor(private http: HttpClient) {
    // Mantém o estado sincronizado com o armazenamento local
    window.addEventListener('storage', () => {
      this.loggedIn.next(this.hasToken());
    });
  }

  /**
   * Envia a requisição de login para o backend.
   * @param loginData Objeto com email e senha
   */
  loginRequest(loginData: any): Observable<any> {
    const url = `${environment.apiUrl}/usuarios/login`;
    return this.http.post(url, loginData);
  }

  /**
   * Salva o token no localStorage e atualiza o estado de login.
   */
  setToken(token: string): void {
    localStorage.setItem('jwt_token', token);
    this.loggedIn.next(true);
  }

  /**
   * Remove o token do localStorage e atualiza o estado.
   */
  logout(): void {
    localStorage.removeItem('jwt_token');
    this.loggedIn.next(false);
  }

  /**
   * Retorna o token armazenado, se existir.
   */
  getToken(): string | null {
    return localStorage.getItem('jwt_token');
  }

  /**
   * Verifica se há token salvo.
   */
  private hasToken(): boolean {
    return !!localStorage.getItem('jwt_token');
  }
}
