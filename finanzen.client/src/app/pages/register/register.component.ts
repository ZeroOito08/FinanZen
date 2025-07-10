import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { NotificationService } from '../../services/notification.service'; // IMPORTAR

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerModel: any = {};

  // INJETAR O NOVO SERVIÇO
  constructor(
    private http: HttpClient, 
    private router: Router,
    private notification: NotificationService
  ) { }

  onRegister() {
    const payload = {
      nome: this.registerModel.nome,
      email: this.registerModel.email,
      senha: this.registerModel.senha
    };

    this.http.post('/api/usuarios', payload).subscribe({
      next: (response) => {
        this.notification.showSuccess('Usuário cadastrado com sucesso! Por favor, faça o login.'); // USAR O SERVIÇO
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.notification.showError('Ocorreu um erro ao tentar cadastrar.'); // USAR O SERVIÇO
      }
    });
  }
}