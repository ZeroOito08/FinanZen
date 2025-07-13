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
  const { email, senha } = this.loginModel; // Extrai os dados do formulário

  this.authService.loginRequest({ email, senha }).subscribe({
    next: (res: any) => {
      this.authService.setToken(res.token); // Armazena o token
      this.router.navigate(['/dashboard']); // Redireciona para o dashboard
    },
    error: (err) => {
      console.error('Erro ao fazer login:', err);
      alert('Email ou senha inválidos.');
    }
  });
}

}