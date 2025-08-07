import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod'; // <-- Importação do ambiente
import { NotificationService } from '../../services/notification.service'; // <-- Sugestão de serviço de notificação

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
    private router: Router,
    private notification: NotificationService // <-- Injeção do serviço de notificação
  ) {
    // Recupera o token da URL
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
    });
  }

  redefinirSenha() {
    // Verifica se as senhas coincidem
    if (!this.novaSenha || this.novaSenha !== this.confirmacaoSenha) {
      this.notification.showError('As senhas não conferem.'); // <-- Uso do serviço de notificação
      return;
    }

    // Envia o token e a nova senha para o backend
    // CORREÇÃO: Usando a URL completa do ambiente
    this.http.post(`${environment.apiUrl}/redefinir-senha`, {
      token: this.token,
      novaSenha: this.novaSenha
    }).subscribe({
      next: () => {
        this.notification.showSuccess('Senha redefinida com sucesso!'); // <-- Uso do serviço de notificação
        this.router.navigate(['/login']);
      },
      error: () => {
        this.notification.showError('Erro ao redefinir senha. O link pode estar expirado ou inválido.'); // <-- Uso do serviço de notificação
      }
    });
  }
}
