import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service'; // 1. Importar

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginModel: any = {};

  // 2. Injetar o AuthService
  constructor(
    private http: HttpClient, 
    private router: Router,
    private authService: AuthService
  ) { }

  onLogin() {
    this.http.post<any>('/api/login', this.loginModel).subscribe({
      next: (response) => {
        localStorage.setItem('jwt_token', response.token);
        this.authService.login(); // 3. AVISAR O SERVIÇO
        this.router.navigate(['/dashboard']); 
      },
      error: (error) => {
        alert('Email ou senha inválidos.');
      }
    });
  }
}