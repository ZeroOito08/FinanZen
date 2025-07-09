import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  // 1. Objeto para guardar os dados do formulário (email e senha)
  loginModel: any = {};

  // 2. Injeta o HttpClient para chamadas de API e o Router para navegação
  constructor(private http: HttpClient, private router: Router) { }

  // 3. Função chamada quando o formulário é enviado
  onLogin() {
    this.http.post<any>('/api/login', this.loginModel).subscribe({
      next: (response) => {
        // Guarda o token no armazenamento local do navegador
        localStorage.setItem('jwt_token', response.token);

        alert('Login realizado com sucesso!');

        // Redireciona o usuário para a rota '/dashboard'
        this.router.navigate(['/dashboard']); 
      },
      error: (error) => {
        console.error('Erro no login!', error);
        alert('Email ou senha inválidos.');
      }
    });
  }
}