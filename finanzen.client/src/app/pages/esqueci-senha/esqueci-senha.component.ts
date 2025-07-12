import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-esqueci-senha',
  templateUrl: './esqueci-senha.component.html',
  styleUrls: ['./esqueci-senha.component.css']
})
export class EsqueciSenhaComponent {
  email: string = '';
  mensagem: string = '';

  constructor(private http: HttpClient) {}

  solicitarReset() {
    this.http.post('/api/esqueci-senha', { email: this.email }).subscribe({
      next: () => this.mensagem = 'Se o e-mail existir, você receberá um link para redefinir sua senha.',
      error: () => this.mensagem = 'Ocorreu um erro ao solicitar redefinição de senha.'
    });
  }
}
