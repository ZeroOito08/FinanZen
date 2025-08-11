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
  isContaMensalSelected = false;

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
      this.model = {
        ...state.transacaoData,
        tipoPagamento: state.transacaoData.tipoPagamento,
        responsavel: state.transacaoData.responsavel
      };
      this.model.data = new Date(this.model.data).toISOString().split('T')[0];
    }
  }

  ngOnInit(): void {
    this.carregarCategorias();
    if (!this.isEditMode) {
      this.model.data = new Date().toISOString().split('T')[0];
      this.model.tipoPagamento = 'Dinheiro';
      this.model.responsavel = 'Gabriel';
    }
  }

  carregarCategorias(): void {
    this.http.get<any[]>(`${environment.apiUrl}/categorias`).subscribe({
      next: (data) => {
        this.categorias = data;
        // Chama a lógica de verificação de categoria após os dados estarem disponíveis
        if (this.isEditMode) {
          this.onCategoriaChange(this.model.categoriaId);
        }
      },
      error: (err) => { this.notification.showError('Falha ao carregar categorias.'); }
    });
  }

  onCategoriaChange(categoriaId: number): void {
    const selectedCategoria = this.categorias.find(c => c.categoriaID === categoriaId);
    this.isContaMensalSelected = selectedCategoria?.nome === 'Conta Mensal';
    if (!this.isContaMensalSelected) {
      this.model.dataVencimento = null;
    }
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
