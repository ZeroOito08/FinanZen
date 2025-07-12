import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-redefinir-senha',
  templateUrl: './redefinir-senha.component.html',
  styleUrls: ['./redefinir-senha.component.css']
})
export class RedefinirSenhaComponent {
  novaSenha = '';
  confirmacaoSenha = '';
  token: string = '';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {
    // Recupera o token da URL
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
    });
  }

  redefinirSenha() {
    // Verifica se as senhas coincidem
    if (!this.novaSenha || this.novaSenha !== this.confirmacaoSenha) {
      alert('As senhas não conferem.');
      return;
    }

    // Envia o token e a nova senha para o backend
    this.http.post('/api/redefinir-senha', {
      token: this.token,
      novaSenha: this.novaSenha
    }).subscribe({
      next: () => {
        alert('Senha redefinida com sucesso!');
        this.router.navigate(['/login']);
      },
      error: () => {
        alert('Erro ao redefinir senha. O link pode estar expirado ou inválido.');
      }
    });
  }
}
