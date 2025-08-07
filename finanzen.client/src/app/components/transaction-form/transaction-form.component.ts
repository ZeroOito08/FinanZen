// C:\Projetos\FinanZen\finanzen.client\src\app\components\transaction-form\transaction-form.component.ts

import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { NotificationService } from '../../services/notification.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-transaction-form',
  templateUrl: './transaction-form.component.html',
  styleUrls: ['./transaction-form.component.css']
})
export class TransactionFormComponent implements OnInit {
  public categorias: any[] = [];
  model: any = {};
  isEditMode = false;

  // Novo array de responsáveis para o dropdown
  public responsaveis: string[] = [
    "Gabriel",
    "Ana Carolina",
    "Viviene",
    "Miguel",
    "Florindo",
    "Valentina",
    "Cecilia",
    "Matteo",
    "Lucca"
  ];

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
      // Define valores padrão para os novos campos
      this.model.tipoPagamento = this.model.tipoPagamento || 'Dinheiro';
      this.model.responsavel = this.model.responsavel || 'Gabriel';
    }
  }

  carregarCategorias(): void {
    this.http.get<any[]>(`${environment.apiUrl}/categorias`).subscribe({
      next: (data) => { this.categorias = data; },
      error: (err) => { this.notification.showError('Falha ao carregar categorias.'); }
    });
  }

  onSubmit() {
    if (this.isEditMode) {
      this.http.put(`${environment.apiUrl}/transacoes/${this.model.transacaoID}`, this.model).subscribe({
        next: () => {
          this.notification.showSuccess('Transação atualizada com sucesso!');
          this.router.navigate(['/minhas-transacoes']);
        },
        error: (err) => this.notification.showError('Falha ao atualizar a transação.')
      });
    } else {
      // O payload já está correto, pois estamos enviando o objeto 'model' completo
      this.http.post(`${environment.apiUrl}/transacoes`, this.model).subscribe({
        next: () => {
          this.notification.showSuccess('Transação salva com sucesso!');
          this.router.navigate(['/minhas-transacoes']);
        },
        error: (err) => this.notification.showError('Erro ao salvar transação.')
      });
    }
  }
}
