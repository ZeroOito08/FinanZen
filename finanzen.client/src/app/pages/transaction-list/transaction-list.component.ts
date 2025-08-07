import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment.prod'; // <-- Importação do arquivo de ambiente
import { TransacaoDetalhes, PaginatedResult } from '../../models/transacao.model';
import { NotificationService } from '../../services/notification.service'; // Importa o serviço de notificação

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.css']
})
export class TransactionListComponent implements OnInit {

  public transacoes: TransacaoDetalhes[] = [];
  public currentPage = 1;
  public totalPages = 1;
  public filtroDataInicio: string = '';
  public filtroDataFim: string = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private notification: NotificationService // Injeta o serviço
  ) { }

  ngOnInit(): void {
    this.carregarTransacoes(this.currentPage);
  }

  carregarTransacoes(page: number): void {
    let params = new HttpParams()
      .set('pageNumber', page.toString())
      .set('pageSize', '10');

    if (this.filtroDataInicio) {
      params = params.append('dataInicio', this.filtroDataInicio);
    }
    if (this.filtroDataFim) {
      params = params.append('dataFim', this.filtroDataFim);
    }

    this.http.get<PaginatedResult<TransacaoDetalhes>>(`${environment.apiUrl}/transacoes`, { params }).subscribe({
      next: (data) => {
        this.transacoes = data.items;
        this.currentPage = data.currentPage;
        this.totalPages = data.totalPages;
      },
      error: (err) => {
        this.notification.showError('Falha ao carregar as transações.');
      }
    });
  }

  aplicarFiltros(): void {
    this.currentPage = 1; // Volta para a primeira página ao aplicar filtros
    this.carregarTransacoes(this.currentPage);
  }

  proximaPagina(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.carregarTransacoes(this.currentPage);
    }
  }

  paginaAnterior(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.carregarTransacoes(this.currentPage);
    }
  }

  editarTransacao(transacao: TransacaoDetalhes): void {
    this.router.navigate(['/transacoes'], { state: { transacaoData: transacao } });
  }

  deletarTransacao(id: number): void {
    if (confirm('Tem certeza que deseja excluir esta transação?')) {
      this.http.delete(`${environment.apiUrl}/transacoes/${id}`).subscribe({
        next: () => {
          this.notification.showSuccess('Transação excluída com sucesso!');
          this.carregarTransacoes(this.currentPage);
        },
        error: () => {
          this.notification.showError('Falha ao excluir a transação.');
        }
      });
    }
  }
}
