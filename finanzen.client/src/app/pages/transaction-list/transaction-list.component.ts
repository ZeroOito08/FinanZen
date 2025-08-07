import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment.prod';
import { TransacaoDetalhes, PaginatedResult } from '../../models/transacao.model';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.css']
})
export class TransactionListComponent implements OnInit {

  public transacoes: TransacaoDetalhes[] = [];
  public categorias: any[] = []; // Adiciona array para categorias
  public currentPage = 1;
  public totalPages = 1;

  // Variáveis para os filtros
  public filtroDataInicio: string = '';
  public filtroDataFim: string = '';
  public filtroResponsavel: string = 'Todos';
  public filtroTipoPagamento: string = 'Todos';
  public filtroTipo: string = 'Todos';
  public filtroCategoria: string = 'Todos';
  
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
  ) { }

  ngOnInit(): void {
    this.carregarCategorias(); // Carrega as categorias ao iniciar
    this.carregarTransacoes(this.currentPage);
  }
  
  carregarCategorias(): void {
    this.http.get<any[]>(`${environment.apiUrl}/categorias`).subscribe({
      next: (data) => { this.categorias = data; },
      error: (err) => { console.error('Erro ao carregar categorias', err); }
    });
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
    // Adicionando os novos filtros à requisição
    if (this.filtroTipo && this.filtroTipo !== 'Todos') {
      params = params.append('tipo', this.filtroTipo);
    }
    if (this.filtroTipoPagamento && this.filtroTipoPagamento !== 'Todos') {
      params = params.append('tipoPagamento', this.filtroTipoPagamento);
    }
    if (this.filtroResponsavel && this.filtroResponsavel !== 'Todos') {
      params = params.append('responsavel', this.filtroResponsavel);
    }
    if (this.filtroCategoria && this.filtroCategoria !== 'Todos') {
      params = params.append('categoriaID', this.filtroCategoria);
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
    this.currentPage = 1;
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
