import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod'; // <-- Importação do ambiente

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
    // CORREÇÃO: Usando a URL completa do ambiente
    this.http.post(`${environment.apiUrl}/esqueci-senha`, { email: this.email }).subscribe({
      next: () => this.mensagem = 'Se o e-mail existir, você receberá um link para redefinir sua senha.',
      error: () => this.mensagem = 'Ocorreu um erro ao solicitar redefinição de senha.'
    });
  }
}
