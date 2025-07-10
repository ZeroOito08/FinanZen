import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { NotificationService } from '../../services/notification.service'; // IMPORTAR

@Component({
  selector: 'app-transaction-form',
  templateUrl: './transaction-form.component.html',
  styleUrls: ['./transaction-form.component.css']
})
export class TransactionFormComponent implements OnInit {
  public categorias: any[] = [];
  model: any = {};
  isEditMode = false;

  // INJETAR O NOVO SERVIÇO
  constructor(
    private http: HttpClient, 
    private router: Router,
    private notification: NotificationService
  ) {
    // ... (lógica do construtor continua a mesma)
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
    this.http.get<any[]>('/api/categorias').subscribe({
      next: (data) => { this.categorias = data; },
      error: (err) => { this.notification.showError('Falha ao carregar categorias.'); } // USAR O SERVIÇO
    });
  }

  onSubmit() {
    if (this.isEditMode) {
      this.http.put(`/api/transacoes/${this.model.transacaoID}`, this.model).subscribe({
        next: () => {
          this.notification.showSuccess('Transação atualizada com sucesso!'); // USAR O SERVIÇO
          this.router.navigate(['/minhas-transacoes']);
        },
        error: (err) => this.notification.showError('Falha ao atualizar a transação.') // USAR O SERVIÇO
      });
    } else {
      const payload = { ...this.model, usuarioId: 1 };
      this.http.post('/api/transacoes', payload).subscribe({
        next: () => {
          this.notification.showSuccess('Transação salva com sucesso!'); // USAR O SERVIÇO
          this.router.navigate(['/minhas-transacoes']);
        },
        error: (err) => this.notification.showError('Erro ao salvar transação.') // USAR O SERVIÇO
      });
    }
  }
}