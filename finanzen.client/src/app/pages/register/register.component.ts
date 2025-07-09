import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerModel: any = {};

  constructor(private http: HttpClient, private router: Router) { }

  onRegister() {
    // Nosso DTO no backend espera 'nome', 'email' e 'senha'
    const payload = {
      nome: this.registerModel.nome,
      email: this.registerModel.email,
      senha: this.registerModel.senha
    };

    this.http.post('/api/usuarios', payload).subscribe({
      next: (response) => {
        alert('Usuário cadastrado com sucesso! Por favor, faça o login.');
        this.router.navigate(['/login']); // Redireciona para o login após o sucesso
      },
      error: (err) => {
        console.error('Erro no cadastro', err);
        // Idealmente, trataríamos erros específicos, como email já existente
        alert('Ocorreu um erro ao tentar cadastrar.');
      }
    });
  }
}