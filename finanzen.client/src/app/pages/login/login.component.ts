import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { NotificationService } from '../../services/notification.service'; // IMPORTAR

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginModel: any = {};

  // INJETAR O NOVO SERVIÇO
  constructor(
    private http: HttpClient, 
    private router: Router, 
    private notification: NotificationService
  ) { }

  onLogin() {
    this.http.post<any>('/api/login', this.loginModel).subscribe({
      next: (response) => {
        localStorage.setItem('jwt_token', response.token);
        this.notification.showSuccess('Login realizado com sucesso!'); // USAR O SERVIÇO
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.notification.showError('Email ou senha inválidos.'); // USAR O SERVIÇO
      }
    });
  }
}