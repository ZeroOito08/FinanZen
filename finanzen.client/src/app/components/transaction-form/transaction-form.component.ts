import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { NotificationService } from '../../services/notification.service';
import { environment } from 'src/environments/environment.prod'; // <-- Importação do ambiente

@Component({
  selector: 'app-transaction-form',
  templateUrl: './transaction-form.component.html',
  styleUrls: ['./transaction-form.component.css']
})
export class TransactionFormComponent implements OnInit {
  public categorias: any[] = [];
  model: any = {};
  isEditMode = false;

  constructor(
    private http: HttpClient, 
    private router: Router,
    private notification: NotificationService
  ) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { transacaoData: any };
    if (state?.transacaoData) {
      this.isEditMode = true;
      this.model = { ...state.transacaoData };
      this.model.data = new Date(this.model.data).toISOString().split('T')[0];
    }
  }

  ngOnInit(): void {
    this.carregarCategorias();
    if (!this.isEditMode) {
      this.model.data = new Date().toISOString().split('T')[0];
    }
  }

  carregarCategorias(): void {
    // CORREÇÃO: Usando a URL completa do ambiente
    this.http.get<any[]>(`${environment.apiUrl}/categorias`).subscribe({
      next: (data) => { this.categorias = data; },
      error: (err) => { this.notification.showError('Falha ao carregar categorias.'); }
    });
  }

  onSubmit() {
    if (this.isEditMode) {
      // CORREÇÃO: Usando a URL completa do ambiente
      this.http.put(`${environment.apiUrl}/transacoes/${this.model.transacaoID}`, this.model).subscribe({
        next: () => {
          this.notification.showSuccess('Transação atualizada com sucesso!');
          this.router.navigate(['/minhas-transacoes']);
        },
        error: (err) => this.notification.showError('Falha ao atualizar a transação.')
      });
    } else {
      const payload = { ...this.model, usuarioId: 1 };
      // CORREÇÃO: Usando a URL completa do ambiente
      this.http.post(`${environment.apiUrl}/transacoes`, payload).subscribe({
        next: () => {
          this.notification.showSuccess('Transação salva com sucesso!');
          this.router.navigate(['/minhas-transacoes']);
        },
        error: (err) => this.notification.showError('Erro ao salvar transação.')
      });
    }
  }
}
