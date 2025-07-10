import { HttpClient, HttpParams } from '@angular/common/http'; // Importa HttpParams
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TransacaoDetalhes } from '../../models/transacao.model';

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.css']
})
export class TransactionListComponent implements OnInit {

  public transacoes: TransacaoDetalhes[] = [];
  // VVV Propriedades para os filtros de data VVV
  public filtroDataInicio: string = '';
  public filtroDataFim: string = '';

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.carregarTransacoes();
  }

  // Agora, o método carregarTransacoes usa os filtros
  carregarTransacoes(): void {
    let params = new HttpParams();
    if (this.filtroDataInicio) {
      params = params.append('dataInicio', this.filtroDataInicio);
    }
    if (this.filtroDataFim) {
      params = params.append('dataFim', this.filtroDataFim);
    }

    // A chamada http agora inclui os parâmetros, se eles existirem
    this.http.get<TransacaoDetalhes[]>('/api/transacoes', { params }).subscribe({
      next: (data) => {
        this.transacoes = data;
      },
      error: (err) => {
        alert('Falha ao carregar as transações.');
      }
    });
  }

  // Este novo método é chamado pelo botão "Filtrar"
  aplicarFiltros(): void {
    this.carregarTransacoes();
  }

  editarTransacao(transacao: TransacaoDetalhes): void {
    this.router.navigate(['/transacoes'], { state: { transacaoData: transacao } });
  }

  deletarTransacao(id: number): void {
    if (confirm('Tem certeza que deseja excluir esta transação?')) {
      this.http.delete(`/api/transacoes/${id}`).subscribe({
        next: () => {
          this.transacoes = this.transacoes.filter(t => t.transacaoID !== id);
        },
        error: (err) => {
          alert('Falha ao excluir a transação.');
        }
      });
    }
  }
}