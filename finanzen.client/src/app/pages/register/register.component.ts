import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { NotificationService } from '../../services/notification.service';
import { environment } from 'src/environments/environment.prod'; // <-- Importação do ambiente

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerModel: any = {};

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

    // CORREÇÃO: Usando a URL completa do ambiente
    this.http.post(`${environment.apiUrl}/usuarios`, payload).subscribe({
      next: (response) => {
        this.notification.showSuccess('Usuário cadastrado com sucesso! Por favor, faça o login.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.notification.showError('Ocorreu um erro ao tentar cadastrar.');
      }
    });
  }
}
